import * as httpClientModule from "../../../api/http-client";

export type CreatePasswordPayload = {
  token: string;
  password: string;
};

export type CreatePasswordResponse = {
  message: string;
};

export type CreatePasswordErrorKind =
  "invalid-token" | "already-configured" | "validation" | "generic";

export class CreatePasswordRequestError extends Error {
  readonly status: number | null;
  readonly kind: CreatePasswordErrorKind;

  constructor(
    message: string,
    options: {
      status?: number | null;
      kind?: CreatePasswordErrorKind;
    } = {},
  ) {
    super(message);
    this.name = "CreatePasswordRequestError";
    this.status = options.status ?? null;
    this.kind = options.kind ?? "generic";
  }
}

type HttpClient = {
  post<T>(url: string, body: unknown): Promise<T | { data: T }>;
};

type HttpClientExports = {
  default?: HttpClient;
  http?: HttpClient;
  httpClient?: HttpClient;
};

type HttpLikeError = {
  status?: number;
  statusCode?: number;
  message?: string;
  detail?: unknown;
  data?: unknown;
  response?: {
    status?: number;
    data?: unknown;
  };
};

function getHttpClient(): HttpClient {
  const exports = httpClientModule as unknown as HttpClientExports;
  const client = exports.httpClient ?? exports.http ?? exports.default;

  if (!client) {
    throw new Error(
      "No se encontró el cliente HTTP compartido. Revisa el export de src/api/http-client.ts.",
    );
  }

  return client;
}

function getStatus(error: unknown): number | null {
  const candidate = error as HttpLikeError;
  return candidate?.response?.status ?? candidate?.status ?? candidate?.statusCode ?? null;
}

function readMessageFromData(data: unknown): string | null {
  if (typeof data === "string") {
    return data;
  }

  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (typeof record.detail === "string") {
    return record.detail;
  }

  if (Array.isArray(record.detail)) {
    const messages = record.detail
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const detailItem = item as Record<string, unknown>;
        return typeof detailItem.msg === "string" ? detailItem.msg : null;
      })
      .filter((item): item is string => Boolean(item));

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  if (typeof record.message === "string") {
    return record.message;
  }

  return null;
}

function sanitizeSensitiveValue(message: string, token: string): string {
  if (!token || !message.includes(token)) {
    return message;
  }

  return message.split(token).join("[token protegido]");
}

function getBackendMessage(error: unknown, token: string): string {
  const candidate = error as HttpLikeError;
  const responseMessage = readMessageFromData(candidate?.response?.data);
  const directMessage =
    readMessageFromData(candidate?.data) ?? readMessageFromData({ detail: candidate?.detail });

  const message =
    responseMessage ??
    directMessage ??
    (typeof candidate?.message === "string"
      ? candidate.message
      : "No fue posible crear la contraseña.");

  return sanitizeSensitiveValue(message, token);
}

function classifyError(status: number | null, message: string): CreatePasswordErrorKind {
  const normalized = message.toLocaleLowerCase("es-MX");

  if ([401, 404, 410].includes(status ?? -1)) {
    return "invalid-token";
  }

  if (status === 409) {
    return "already-configured";
  }

  if (status === 422) {
    return "validation";
  }

  if (status === 400) {
    const looksLikeInvalidToken = [
      "token",
      "expir",
      "caduc",
      "utiliz",
      "activación",
      "activacion",
      "enlace",
    ].some((term) => normalized.includes(term));

    if (looksLikeInvalidToken) {
      return "invalid-token";
    }

    const looksLikeConfiguredAccount =
      (normalized.includes("contraseña") || normalized.includes("password")) &&
      (normalized.includes("ya") || normalized.includes("configur"));

    if (looksLikeConfiguredAccount) {
      return "already-configured";
    }
  }

  return "generic";
}

export async function createPasswordRequest(
  payload: CreatePasswordPayload,
): Promise<CreatePasswordResponse> {
  try {
    const client = getHttpClient();

    // El contrato del backend exige exactamente token + password.
    // confirmPassword nunca debe salir de la capa de formulario.
    const response = await client.post<CreatePasswordResponse>("/users/crear-password", {
      token: payload.token,
      password: payload.password,
    });

    if (response && typeof response === "object" && "data" in response) {
      return response.data;
    }

    return response;
  } catch (error) {
    if (error instanceof CreatePasswordRequestError) {
      throw error;
    }

    const status = getStatus(error);
    const message = getBackendMessage(error, payload.token);

    throw new CreatePasswordRequestError(message, {
      status,
      kind: classifyError(status, message),
    });
  }
}
