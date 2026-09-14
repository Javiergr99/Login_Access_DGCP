import { describe, expect, it } from "vitest";

import { loginSchema } from "@/features/auth/schemas/login.schema";

describe("loginSchema", () => {
  it("acepta una CURP de exactamente 18 caracteres", () => {
    const result = loginSchema.safeParse({
      curp: "ABCD00000000000000",
      password: "Prueba123!",
      rememberSession: false,
    });

    expect(result.success).toBe(true);
  });

  it("normaliza la CURP a mayúsculas antes del login", () => {
    const result = loginSchema.parse({
      curp: "abcd00000000000000",
      password: "Prueba123!",
      rememberSession: false,
    });

    expect(result.curp).toBe("ABCD00000000000000");
  });

  it("rechaza identificadores con más de 18 caracteres", () => {
    const result = loginSchema.safeParse({
      curp: "admin@portusderechos.gob.mx",
      password: "123",
      rememberSession: false,
    });

    expect(result.success).toBe(false);
  });

  it("rechaza una CURP incompleta", () => {
    const result = loginSchema.safeParse({
      curp: "ABCD000000",
      password: "123",
      rememberSession: false,
    });

    expect(result.success).toBe(false);
  });
});
