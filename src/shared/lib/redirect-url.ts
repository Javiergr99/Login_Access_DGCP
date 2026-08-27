const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

function removeTrailingPathSlashes(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "") || "/";
}

/**
 * Convierte un destino configurado en una URL canónica para comparaciones
 * exactas con la lista blanca de auth_service.
 *
 * La URL enviada a POST /auth/redirect-code debe estar completamente limpia:
 * sin código temporal, parámetros de consulta ni fragmentos.
 */
export function normalizeRedirectUrl(value: string): string {
  const candidate = value.trim();

  if (!candidate) {
    throw new Error("La URL de destino no está configurada.");
  }

  let url: URL;

  try {
    url = new URL(candidate);
  } catch {
    throw new Error("La URL de destino debe ser absoluta e incluir http:// o https://.");
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    throw new Error("La URL de destino utiliza un protocolo no permitido.");
  }

  if (url.username || url.password) {
    throw new Error("La URL de destino no puede incluir credenciales.");
  }

  if (url.search) {
    throw new Error("La URL autorizada no puede incluir parámetros de consulta.");
  }

  if (url.hash) {
    throw new Error("La URL autorizada no puede incluir fragmentos.");
  }

  url.pathname = removeTrailingPathSlashes(url.pathname);

  return url.toString();
}

/**
 * Agrega los parámetros que consume el frontend de destino únicamente después
 * de que auth_service autorizó la URL limpia y emitió el código temporal.
 */
export function appendRedirectExchangeParams({
  redirectUrl,
  code,
  persistence,
}: {
  redirectUrl: string;
  code: string;
  persistence: "session" | "persistent";
}): string {
  const normalizedCode = code.trim();
  if (!normalizedCode) {
    throw new Error("auth_service no devolvió un código temporal válido.");
  }

  const destination = new URL(normalizeRedirectUrl(redirectUrl));
  destination.searchParams.set("code", normalizedCode);
  destination.searchParams.set("persistence", persistence);
  return destination.toString();
}
