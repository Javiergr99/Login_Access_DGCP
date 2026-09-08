import {
  loadProductionEnvironment,
  validateBooleanFalse,
  validateProductionUrl,
} from "./lib/production-env-validator.mjs";

const REQUIRED_URLS = ["VITE_API_URL", "VITE_MESA_AYUDA_URL"];

const OPTIONAL_URLS = [
  "VITE_FORMATO_NNA_URL",
  "VITE_DIRECTORIO_PROCURADORES_URL",
  "VITE_CONTROL_AGENDA_URL",
  "VITE_ADMIN_URL",
  "VITE_GOBMX_SEARCH_URL",
  "VITE_FORMATO_NNA_PUBLIC_URL",
];

console.log("");
console.log("======================================================");
console.log(" LOGIN ACCESS - VALIDACION DE ENTORNO PRODUCCION");
console.log("======================================================");

const { environment, loadedFiles } = loadProductionEnvironment(process.cwd());
const issues = [];

for (const variableName of REQUIRED_URLS) {
  issues.push(...validateProductionUrl(variableName, environment[variableName]));
}

for (const variableName of OPTIONAL_URLS) {
  issues.push(
    ...validateProductionUrl(variableName, environment[variableName], {
      required: false,
    }),
  );
}

issues.push(...validateBooleanFalse("VITE_ENABLE_MOCKS", environment.VITE_ENABLE_MOCKS));

console.log("");
console.log(
  loadedFiles.length
    ? `Archivos de entorno detectados: ${loadedFiles.join(", ")}`
    : "Archivos de entorno detectados: ninguno; se validará process.env.",
);

if (issues.length) {
  console.error("");
  console.error("FAIL: configuración de producción inválida.");
  for (const issue of issues) {
    console.error(`- ${issue.variable}: ${issue.message}`);
  }
  console.error("");
  console.error("No se generó build.");
  process.exit(1);
}

console.log("");
console.log("PASS: Login Access listo para build de producción.");
console.log("PASS: Auth y Mesa configurados sin localhost.");
console.log("PASS: mocks deshabilitados.");
console.log("PASS: destinos opcionales definidos, si existen, son válidos.");
