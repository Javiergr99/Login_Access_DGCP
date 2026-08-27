import { describe, expect, it } from "vitest";

import { loginSchema } from "@/features/auth/schemas/login.schema";

describe("loginSchema", () => {
  it("acepta credenciales con una CURP válida", () => {
    const result = loginSchema.safeParse({
      curp: "HUSO900101MDFRRF01",
      password: "MesaAyuda2026!",
      rememberSession: false,
    });

    expect(result.success).toBe(true);
  });

  it("rechaza un correo electrónico en el campo CURP", () => {
    const result = loginSchema.safeParse({
      curp: "admin@portusderechos.gob.mx",
      password: "123",
      rememberSession: false,
    });

    expect(result.success).toBe(false);
  });

  it("rechaza una CURP incompleta", () => {
    const result = loginSchema.safeParse({
      curp: "HUSO900101MDF",
      password: "123",
      rememberSession: false,
    });

    expect(result.success).toBe(false);
  });
});
