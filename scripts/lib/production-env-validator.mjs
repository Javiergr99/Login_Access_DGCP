import fs from "node:fs";
import path from "node:path";

const LOOPBACK_HOSTS = new Set(["localhost", "0.0.0.0", "::", "::1", "[::]", "[::1]"]);

function stripInlineComment(value) {
  const trimmed = value.trim();

  if (!trimmed) return "";

  const quote = trimmed[0];
  if ((quote === '"' || quote === "'") && trimmed.endsWith(quote)) {
    return trimmed.slice(1, -1);
  }

  const hashIndex = trimmed.search(/\s+#/);
  return hashIndex >= 0 ? trimmed.slice(0, hashIndex).trimEnd() : trimmed;
}

export function parseEnv(contents) {
  const result = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const normalized = line.startsWith("export ") ? line.slice(7).trimStart() : line;
    const separator = normalized.indexOf("=");
    if (separator <= 0) continue;

    const key = normalized.slice(0, separator).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;

    result[key] = stripInlineComment(normalized.slice(separator + 1));
  }

  return result;
}

export function loadProductionEnvironment(
  rootDirectory = process.cwd(),
  processEnvironment = process.env,
) {
  const loaded = {};
  const loadedFiles = [];

  for (const fileName of [".env", ".env.local", ".env.production", ".env.production.local"]) {
    const filePath = path.join(rootDirectory, fileName);
    if (!fs.existsSync(filePath)) continue;

    Object.assign(loaded, parseEnv(fs.readFileSync(filePath, "utf8")));
    loadedFiles.push(fileName);
  }

  return {
    environment: {
      ...loaded,
      ...processEnvironment,
    },
    loadedFiles,
  };
}

function isLoopbackHostname(hostname) {
  const normalized = hostname.toLowerCase();

  if (LOOPBACK_HOSTS.has(normalized)) return true;
  return /^127(?:\.\d{1,3}){3}$/.test(normalized);
}

export function validateProductionUrl(variableName, rawValue, { required = true } = {}) {
  const issues = [];
  const value = typeof rawValue === "string" ? rawValue.trim() : "";

  if (!value) {
    if (required) {
      issues.push({
        variable: variableName,
        message: "variable obligatoria ausente o vacía",
      });
    }
    return issues;
  }

  if (rawValue !== value) {
    issues.push({
      variable: variableName,
      message: "contiene espacios al inicio o al final",
    });
  }

  if (value.endsWith("/")) {
    issues.push({
      variable: variableName,
      message: "no debe terminar con slash (/)",
    });
  }

  let url;

  try {
    url = new URL(value);
  } catch {
    issues.push({
      variable: variableName,
      message: "no contiene una URL absoluta válida",
    });
    return issues;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    issues.push({
      variable: variableName,
      message: "solo se permiten URLs http:// o https://",
    });
  }

  if (!url.hostname) {
    issues.push({
      variable: variableName,
      message: "la URL no contiene hostname",
    });
  } else if (isLoopbackHostname(url.hostname)) {
    issues.push({
      variable: variableName,
      message: "localhost/loopback está prohibido en producción",
    });
  }

  if (url.username || url.password) {
    issues.push({
      variable: variableName,
      message: "la URL no puede contener credenciales embebidas",
    });
  }

  if (url.hash) {
    issues.push({
      variable: variableName,
      message: "la URL base no debe contener fragmentos (#...)",
    });
  }

  return issues;
}

export function validateBooleanFalse(variableName, rawValue) {
  const value = typeof rawValue === "string" ? rawValue.trim().toLowerCase() : "";

  if (value !== "false") {
    return [
      {
        variable: variableName,
        message: 'debe estar definida exactamente como "false" en producción',
      },
    ];
  }

  return [];
}
