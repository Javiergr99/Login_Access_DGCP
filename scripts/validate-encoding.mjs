import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const ignoredDirectories = new Set([
  ".git",
  ".venv",
  "node_modules",
  "dist",
  "coverage",
  "playwright-report",
  "playwright-report-real",
  "test-results",
]);

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".css",
  ".scss",
  ".html",
  ".htm",
  ".yml",
  ".yaml",
  ".txt",
]);

const textFilesWithoutRelevantExtension = new Set([
  ".editorconfig",
  ".gitattributes",
  ".gitignore",
  ".prettierignore",
  ".env.example",
]);

const utf8Decoder = new TextDecoder("utf-8", {
  fatal: true,
});

const suspiciousPatterns = [
  {
    name: "Posible mojibake o texto UTF-8 mal interpretado",
    pattern: /[\u00C3\u00C2\u00E2\u00F0\u00EF]/u,
  },
  {
    name: "Carácter Unicode de reemplazo",
    pattern: /\uFFFD/u,
  },
];

function shouldInspect(filePath) {
  const fileName = path.basename(filePath);

  return (
    textExtensions.has(path.extname(fileName).toLowerCase()) ||
    textFilesWithoutRelevantExtension.has(fileName)
  );
}

async function collectFiles(directory) {
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        continue;
      }

      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && shouldInspect(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function hasUtf8Bom(buffer) {
  return buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
}

function relative(filePath) {
  return path.relative(root, filePath);
}

function firstMatchingLine(content, pattern) {
  const lines = content.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    if (pattern.test(lines[index])) {
      pattern.lastIndex = 0;
      return index + 1;
    }

    pattern.lastIndex = 0;
  }

  return null;
}

const files = await collectFiles(root);
const issues = [];

for (const file of files) {
  const buffer = await readFile(file);

  if (hasUtf8Bom(buffer)) {
    issues.push({
      file: relative(file),
      reason: "Contiene BOM UTF-8.",
    });
  }

  let content;

  try {
    content = utf8Decoder.decode(buffer);
  } catch {
    issues.push({
      file: relative(file),
      reason: "No contiene UTF-8 válido.",
    });

    continue;
  }

  for (const { name, pattern } of suspiciousPatterns) {
    const line = firstMatchingLine(content, pattern);

    if (line !== null) {
      issues.push({
        file: relative(file),
        reason: `${name} en línea ${line}.`,
      });
    }
  }
}

if (issues.length > 0) {
  console.error("");
  console.error("Validación de encoding fallida:");
  console.error("");

  for (const issue of issues) {
    console.error(`- ${issue.file}: ${issue.reason}`);
  }

  console.error("");
  console.error("Todos los archivos de texto deben usar UTF-8 sin BOM y no contener mojibake.");
  console.error("");

  process.exitCode = 1;
} else {
  console.log(`Encoding validado: ${files.length} archivos UTF-8 sin BOM ni mojibake conocido.`);
}
