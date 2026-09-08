import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();

const developmentDefaults = {
  VITE_MESA_AYUDA_URL: "http://127.0.0.1:5173/app/dashboard",
  VITE_FORMATO_NNA_URL: "http://127.0.0.1:5175/app/dashboard",
  VITE_DIRECTORIO_PROCURADORES_URL: "http://127.0.0.1:5177/procuradores",
  VITE_CONTROL_AGENDA_URL: "http://127.0.0.1:5179/app/dashboard",
  VITE_ADMIN_URL: "http://127.0.0.1:5180/app/dashboard",
};

const destinationKeys = Object.keys(developmentDefaults);

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

function isLoopback(hostname) {
  const normalized = hostname.toLowerCase();

  return (
    normalized === "localhost" ||
    normalized === "::1" ||
    normalized === "[::1]" ||
    /^127(?:\.\d{1,3}){3}$/.test(normalized)
  );
}

function normalize(value, key, productionMode) {
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

  if (productionMode && isLoopback(url.hostname)) {
    throw new Error(`${key} utiliza localhost/loopback en producción.`);
  }

  if (!productionMode && url.hostname === "localhost") {
    throw new Error(`${key} utiliza localhost. El contrato local vigente exige 127.0.0.1.`);
  }

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  return url.toString();
}

try {
  const productionFiles = [".env.production", ".env.production.local"].filter((fileName) =>
    fs.existsSync(path.join(cwd, fileName)),
  );

  const productionMode = productionFiles.length > 0;

  const fileValues = {
    ...parseEnvFile(path.join(cwd, ".env")),
    ...parseEnvFile(path.join(cwd, ".env.local")),
    ...parseEnvFile(path.join(cwd, ".env.production")),
    ...parseEnvFile(path.join(cwd, ".env.production.local")),
  };

  const values = productionMode
    ? fileValues
    : {
        ...developmentDefaults,
        ...fileValues,
      };

  const configured = [];

  for (const key of destinationKeys) {
    const value = (values[key] ?? "").trim();

    if (value) {
      configured.push([key, value]);
    }
  }

  if (!configured.some(([key]) => key === "VITE_MESA_AYUDA_URL")) {
    throw new Error("VITE_MESA_AYUDA_URL es obligatoria.");
  }

  const destinations = configured.map(([key, value]) => normalize(value, key, productionMode));

  if (new Set(destinations).size !== destinations.length) {
    throw new Error("Cada módulo configurado debe tener una URL de redirección única.");
  }

  console.log(
    productionMode
      ? "\nURLs exactas configuradas para el servidor:\n"
      : "\nURLs exactas configuradas para desarrollo:\n",
  );

  for (const destination of destinations) {
    console.log(`- ${destination}`);
  }

  console.log("\nValor para ALLOWED_REDIRECT_URLS:\n");
  console.log(`ALLOWED_REDIRECT_URLS=${destinations.join(",")}`);
  console.log("");
} catch (error) {
  console.error("\nConfiguración de redirecciones inválida:\n");
  console.error(`- ${error instanceof Error ? error.message : String(error)}`);
  console.error("");
  process.exitCode = 1;
}
