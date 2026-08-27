import { access, readFile, readdir } from "node:fs/promises";
import { constants } from "node:fs";
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

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function collectTypeScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".github") {
      continue;
    }

    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const absolutePath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectTypeScriptFiles(absolutePath)));
      continue;
    }

    if (sourceExtensions.includes(extname(entry.name))) {
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

      if (specifier?.startsWith(".")) {
        imports.add(specifier.split("?")[0].split("#")[0]);
      }
    }
  }

  return [...imports];
}

async function resolveLocalImport(sourceFile, specifier) {
  const base = resolve(dirname(sourceFile), specifier);

  if (await exists(base)) {
    return true;
  }

  for (const extension of resolutionExtensions) {
    if (await exists(`${base}${extension}`)) {
      return true;
    }
  }

  for (const extension of resolutionExtensions) {
    if (await exists(resolve(base, `index${extension}`))) {
      return true;
    }
  }

  return false;
}

const missingRequired = [];

for (const relativePath of requiredPaths) {
  if (!(await exists(resolve(root, relativePath)))) {
    missingRequired.push(relativePath);
  }
}

if (missingRequired.length > 0) {
  console.error("La estructura del proyecto está incompleta:");

  for (const path of missingRequired) {
    console.error(`- ${path}`);
  }

  process.exit(1);
}

const typeScriptFiles = await collectTypeScriptFiles(root);
const missingImports = [];

for (const file of typeScriptFiles) {
  const source = await readFile(file, "utf8");
  const imports = extractLocalImports(source);

  for (const specifier of imports) {
    if (!(await resolveLocalImport(file, specifier))) {
      missingImports.push({
        file: relative(root, file),
        specifier,
      });
    }
  }
}

if (missingImports.length > 0) {
  console.error("Se encontraron importaciones locales sin resolver:");

  for (const item of missingImports) {
    console.error(`- ${item.file} -> ${item.specifier}`);
  }

  process.exit(1);
}

console.log(
  `Estructura validada: ${typeScriptFiles.length} archivos TypeScript y ninguna importación local faltante.`,
);
