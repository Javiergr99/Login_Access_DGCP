import fs from "node:fs";
import path from "node:path";

const distDirectory = path.resolve(process.cwd(), "dist");

if (!fs.existsSync(distDirectory)) {
  console.error("FAIL: dist no existe. Ejecuta primero el build de producción.");
  process.exit(1);
}

const textExtensions = new Set([".js", ".css", ".html", ".map"]);
const findings = [];

/*
 * Algunas dependencias legítimas (por ejemplo React Router y Axios) incluyen
 * internamente el literal genérico "http://localhost" como base de respaldo
 * para construir URLs cuando no existe window.location.
 *
 * Ese texto no representa configuración de red de DGCP y no debe convertir un
 * bundle válido en falso positivo.
 *
 * Este gate sí bloquea:
 * - cualquier dirección 127.x.x.x;
 * - localhost con puerto explícito;
 * - localhost seguido de rutas típicas de aplicación/API.
 *
 * La configuración real VITE_* se valida por separado antes del build, y el
 * código fuente propio se audita para impedir fallbacks loopback.
 */
const forbiddenPatterns = [
  {
    label: "IP loopback 127.x.x.x",
    expression: /\b127(?:\.\d{1,3}){3}\b/i,
  },
  {
    label: "localhost con puerto",
    expression: /https?:\/\/localhost:\d+/i,
  },
  {
    label: "localhost usado como endpoint de aplicación",
    expression:
      /https?:\/\/localhost\/(?:app|auth|api|mesa-api|users|accesos|perfil)(?:\/|["'`?#]|$)/i,
  },
];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(absolutePath);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name))) continue;

    const contents = fs.readFileSync(absolutePath, "utf8");

    for (const pattern of forbiddenPatterns) {
      if (pattern.expression.test(contents)) {
        findings.push({
          file: path.relative(distDirectory, absolutePath),
          reason: pattern.label,
        });
      }
    }
  }
}

walk(distDirectory);

if (findings.length > 0) {
  console.error("");
  console.error("FAIL: el bundle de producción contiene endpoints loopback prohibidos.");

  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.reason}`);
  }

  console.error("");
  process.exit(1);
}

console.log(
  "PASS: bundle sin endpoints loopback de aplicación (127.x.x.x / localhost con puerto o ruta DGCP).",
);
