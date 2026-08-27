import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();

const defaults = {
  VITE_MESA_AYUDA_URL: "http://127.0.0.1:5173/app/dashboard",
  VITE_FORMATO_NNA_URL: "http://127.0.0.1:5175/app/dashboard",
  VITE_DIRECTORIO_PROCURADORES_URL: "http://127.0.0.1:5177/procuradores",
  VITE_CONTROL_AGENDA_URL: "http://127.0.0.1:5179/app/dashboard",
  VITE_ADMIN_URL: "http://127.0.0.1:5180/app/dashboard",
};

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator).trim();
        const value = line
          .slice(separator + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");

        return [key, value];
      }),
  );
}

function normalize(value, key) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${key} debe ser una URL absoluta válida.`);
  }

  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new Error(`${key} debe utilizar http:// o https://.`);
  }

  if (url.username || url.password) {
    throw new Error(`${key} no puede incluir credenciales.`);
  }

  if (url.search) {
    throw new Error(`${key} no puede incluir parámetros de consulta.`);
  }

  if (url.hash) {
    throw new Error(`${key} no puede incluir fragmentos.`);
  }

  if (url.hostname === "localhost") {
    throw new Error(`${key} utiliza localhost. El contrato local vigente exige 127.0.0.1.`);
  }

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  return url.toString();
}

try {
  const fileValues = {
    ...parseEnvFile(path.join(cwd, ".env")),
    ...parseEnvFile(path.join(cwd, ".env.local")),
  };

  const values = {
    ...defaults,
    ...fileValues,
  };

  const destinations = Object.keys(defaults).map((key) => normalize(values[key], key));

  if (new Set(destinations).size !== destinations.length) {
    throw new Error("Cada módulo debe tener una URL de redirección única.");
  }

  console.log("\nURLs exactas configuradas en el frontend:\n");

  for (const destination of destinations) {
    console.log(`- ${destination}`);
  }

  console.log("\nValor para la lista blanca local de auth_service:\n");
  console.log(`ALLOWED_REDIRECT_URLS=${destinations.join(",")}`);
  console.log("");
} catch (error) {
  console.error("\nConfiguración de redirecciones inválida:\n");
  console.error(`- ${error instanceof Error ? error.message : String(error)}`);
  console.error("");
  process.exitCode = 1;
}
