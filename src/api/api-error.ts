import axios from "axios";

const DEFAULT_ERROR_MESSAGE = "No fue posible completar la solicitud.";

export class ApiError extends Error {
  readonly code: string;
  readonly status: number | null;
  readonly fieldErrors: Record<string, string[]>;

  constructor({
    code,
    message,
    status = null,
    fieldErrors = {},
  }: {
    code: string;
    message: string;
    status?: number | null;
    fieldErrors?: Record<string, string[]>;
  }) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type NestedErrorDetail = {
  code?: unknown;
  detail?: unknown;
};

type ValidationItem = {
  loc?: unknown;
  msg?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function validationFieldErrors(items: unknown[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const item of items) {
    if (!isRecord(item)) continue;

    const validationItem = item as ValidationItem;
    const location = isUnknownArray(validationItem.loc) ? validationItem.loc : [];
    const field = [...location]
      .reverse()
      .find((part): part is string => typeof part === "string" && part !== "body");
    const message =
      typeof validationItem.msg === "string"
        ? validationItem.msg
        : "El valor ingresado no es válido.";

    if (!field) continue;
    result[field] = [...(result[field] ?? []), message];
  }

  return result;
}

function parsePayload(payload: unknown): {
  code: string;
  message: string;
  fieldErrors: Record<string, string[]>;
} | null {
  if (!isRecord(payload)) return null;

  const directCode = payload.code;
  const directDetail = payload.detail;
  const directFieldErrors = payload.field_errors;

  if (typeof directCode === "string" && typeof directDetail === "string") {
    return {
      code: directCode,
      message: directDetail,
      fieldErrors: isRecord(directFieldErrors)
        ? (directFieldErrors as Record<string, string[]>)
        : {},
    };
  }

  if (isRecord(directDetail)) {
    const nested = directDetail as NestedErrorDetail;
    if (typeof nested.detail === "string") {
      return {
        code: typeof nested.code === "string" ? nested.code : "INTERNAL_ERROR",
        message: nested.detail,
        fieldErrors: {},
      };
    }
  }

  if (Array.isArray(directDetail)) {
    return {
      code: "VALIDATION_ERROR",
      message: "Revisa los campos marcados e inténtalo nuevamente.",
      fieldErrors: validationFieldErrors(directDetail),
    };
  }

  if (typeof directDetail === "string") {
    return {
      code: "INTERNAL_ERROR",
      message: directDetail,
      fieldErrors: {},
    };
  }

  return null;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const parsed = parsePayload(error.response?.data);

    if (parsed) {
      return new ApiError({
        code: parsed.code,
        message: parsed.message,
        status: error.response?.status ?? null,
        fieldErrors: parsed.fieldErrors,
      });
    }

    if (!error.response) {
      return new ApiError({
        code: "INTERNAL_ERROR",
        message:
          "No fue posible establecer comunicación con el servicio. Verifica que el backend esté activo e inténtalo nuevamente.",
      });
    }

    return new ApiError({
      code:
        error.response.status === 401
          ? "UNAUTHORIZED"
          : error.response.status === 403
            ? "FORBIDDEN"
            : "INTERNAL_ERROR",
      message: DEFAULT_ERROR_MESSAGE,
      status: error.response.status,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      code: "INTERNAL_ERROR",
      message: error.message || DEFAULT_ERROR_MESSAGE,
    });
  }

  return new ApiError({
    code: "INTERNAL_ERROR",
    message: DEFAULT_ERROR_MESSAGE,
  });
}

export function getApiErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MESSAGE) {
  const normalized = normalizeApiError(error);
  return normalized.message || fallback;
}

export function getFirstFieldError(error: unknown, fieldName: string) {
  const normalized = normalizeApiError(error);
  return normalized.fieldErrors[fieldName]?.[0];
}
