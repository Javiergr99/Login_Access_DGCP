import { describe, expect, it } from "vitest";

import { createPasswordSchema } from "../../src/features/auth/schemas/create-password.schema";

describe("createPasswordSchema", () => {
  it("valida una contraseña correcta y su confirmación", () => {
    const result = createPasswordSchema.safeParse({
      password: "Prueba123!",
      confirmPassword: "Prueba123!",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza confirmaciones diferentes", () => {
    const result = createPasswordSchema.safeParse({
      password: "Prueba123!",
      confirmPassword: "Prueba123?",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.message === "Las contraseñas no coinciden."),
      ).toBe(true);
    }
  });

  it("rechaza una contraseña menor a ocho caracteres", () => {
    const result = createPasswordSchema.safeParse({
      password: "Ab1!",
      confirmPassword: "Ab1!",
    });

    expect(result.success).toBe(false);
  });
});
