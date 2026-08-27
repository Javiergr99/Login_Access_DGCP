import { normalizeApiError } from "@/api/api-error";

export type AccessEntryError = {
  title: string;
  message: string;
  destination?: string;
};

const REDIRECT_REJECTED_PATTERN =
  /url.*redirecci[oó]n.*permitida|redirecci[oó]n.*no.*permitida|redirect.*not.*allowed/i;

export function mapAccessEntryError(error: unknown, destination?: string): AccessEntryError {
  const normalizedError = normalizeApiError(error);
  const redirectRejected =
    normalizedError.status === 403 &&
    (normalizedError.code === "REDIRECT_URL_NOT_ALLOWED" ||
      REDIRECT_REJECTED_PATTERN.test(normalizedError.message));

  if (redirectRejected) {
    return {
      title: "Destino no autorizado por auth_service",
      message:
        "La sesión es válida, pero la URL del módulo no coincide exactamente con la lista blanca del backend. Verifica protocolo, host, puerto, ruta y diagonal final.",
      destination,
    };
  }

  return {
    title: "No fue posible ingresar",
    message:
      normalizedError.message || "No fue posible generar el acceso seguro al módulo seleccionado.",
  };
}
