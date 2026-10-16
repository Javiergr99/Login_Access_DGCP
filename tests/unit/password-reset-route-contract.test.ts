import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const routerSource = fs.readFileSync(
  path.resolve(process.cwd(), "src/app/router/router.tsx"),
  "utf8",
);

describe("password reset route contract", () => {
  it("mantiene la ruta canónica de restablecimiento", () => {
    expect(routerSource).toContain('path: "restablecer-contrasena"');
  });

  it("acepta la ruta de compatibilidad emitida por auth_service", () => {
    expect(routerSource).toContain('path: "restablecer-password"');
  });

  it("ambas rutas usan ResetPasswordPage", () => {
    const occurrences = routerSource.split("<ResetPasswordPage />").length - 1;

    expect(occurrences).toBeGreaterThanOrEqual(2);
  });
});
