import { accessSync, constants, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

const requiredPaths = [
  "src/app/providers/query-client.ts",
  "src/app/router/router.tsx",
  "src/app/styles/index.css",
  "src/components/layout/auth-layout.tsx",
  "src/components/layout/access-layout.tsx",
  "src/components/ui/button.tsx",
  "src/components/ui/otp-input.tsx",
  "src/features/auth/pages/login-page.tsx",
  "src/features/auth/pages/mfa-verify-page.tsx",
  "src/features/access/pages/access-page.tsx",
  "docs/ARQUITECTURA.md",
  "docs/AUTENTICACION_Y_SEGURIDAD.md",
];

const ignoredDirectories = new Set([
  "node_modules",
  "dist",
  "coverage",
  ".vite",
  ".cache",
  "playwright-report",
  "playwright-report-real",
  "test-results",
]);

const sourceExtensions = [".ts", ".tsx"];
const resolutionExtensions = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"];

function exists(filePath) {
  try {
    accessSync(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function collectTypeScriptFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".github") continue;
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTypeScriptFiles(absolutePath));
    } else if (sourceExtensions.includes(extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

function extractLocalImports(source) {
  const imports = new Set();
  const patterns = [
    /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g,
    /import\(\s*["']([^"']+)["']\s*\)/g,
    /require\(\s*["']([^"']+)["']\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];
      if (specifier?.startsWith(".")) imports.add(specifier.split("?")[0].split("#")[0]);
    }
  }

  return [...imports];
}

function resolveLocalImport(sourceFile, specifier) {
  const base = resolve(dirname(sourceFile), specifier);

  if (existsSync(base)) return true;

  // Solo consideramos una extensión explícita cuando es una extensión de módulo
  // reconocida. Nombres válidos como `foo.schema` o `bar.contracts` deben seguir
  // probándose como `foo.schema.ts`, `bar.contracts.ts`, etc.
  const explicitExtension = extname(base);
  if (resolutionExtensions.includes(explicitExtension)) return false;

  const candidates = [
    ...resolutionExtensions.map((extension) => `${base}${extension}`),
    ...resolutionExtensions.map((extension) => resolve(base, `index${extension}`)),
  ];

  return candidates.some(existsSync);
}

const missingRequired = requiredPaths.filter(
  (relativePath) => !exists(resolve(root, relativePath)),
);

if (missingRequired.length > 0) {
  console.error("La estructura del proyecto está incompleta:");
  for (const path of missingRequired) console.error(`- ${path}`);
  process.exit(1);
}

const typeScriptFiles = collectTypeScriptFiles(root);
const missingImports = [];

for (const file of typeScriptFiles) {
  const source = readFileSync(file, "utf8");

  for (const specifier of extractLocalImports(source)) {
    if (!resolveLocalImport(file, specifier)) {
      missingImports.push({ file: relative(root, file), specifier });
    }
  }
}

if (missingImports.length > 0) {
  console.error("Se encontraron importaciones locales sin resolver:");
  for (const item of missingImports) console.error(`- ${item.file} -> ${item.specifier}`);
  process.exit(1);
}

console.log(
  `Estructura validada: ${typeScriptFiles.length} archivos TypeScript y ninguna importación local faltante.`,
);
