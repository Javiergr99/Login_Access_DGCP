import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string) {
  return fs.readFileSync(path.resolve(process.cwd(), relativePath), "utf8");
}

describe("access navigation contract", () => {
  const header = readSource("src/components/layout/app-header.tsx");

  it("utiliza rutas internas reales", () => {
    expect(header).toContain('to="/accesos"');
    expect(header).toContain('to="/perfil"');

    expect(header).not.toContain('href: "#dashboard"');
    expect(header).not.toContain('href: "#agenda"');
    expect(header).not.toContain('href: "#micrositio"');
    expect(header).not.toContain('href: "#por-tus-derechos"');
  });

  it("no presenta la campana sin funcionalidad", () => {
    expect(header).not.toContain('aria-label="Notificaciones"');
  });

  it("mantiene una sola ruta de reset por URL", () => {
    const router = readSource("src/app/router/router.tsx");

    expect(router.match(/path:\s*"restablecer-password"/g)).toHaveLength(1);

    expect(router.match(/path:\s*"restablecer-contrasena"/g)).toHaveLength(1);
  });

  it("protege la CURP en el resumen", () => {
    const summary = readSource("src/features/access/components/user-permission-summary.tsx");

    expect(summary).toContain("user.curp.slice(-4)");
    expect(summary).not.toContain("CURP: {user.curp}");
  });
});
