import { beforeEach, describe, expect, it, vi } from "vitest";

const { postMock } = vi.hoisted(() => ({
  postMock: vi.fn(),
}));

vi.mock("@/api/http-client", () => ({
  httpClient: {
    post: postMock,
  },
  refreshSessionWithCookie: vi.fn(),
}));

import { httpAuthService } from "../../src/features/auth/api/auth.service";
import { passwordSchema } from "../../src/features/auth/schemas/password.schema";

describe("contrato de recuperación de contraseña", () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it("consume el endpoint oficial de auth_service con el payload esperado", async () => {
    postMock.mockResolvedValue({
      data: { message: "Contraseña actualizada correctamente." },
    });

    const input = {
      token: "token-recuperacion-prueba",
      password_nueva: "NuevaClave123!",
    };

    await expect(httpAuthService.resetPassword(input)).resolves.toEqual({
      message: "Contraseña actualizada correctamente.",
    });

    expect(postMock).toHaveBeenCalledTimes(1);
    expect(postMock).toHaveBeenCalledWith("/auth/restablecer-password", input);
  });
});

describe("política de contraseña en recuperación", () => {
  it("acepta una contraseña que cumple la política compartida", () => {
    expect(
      passwordSchema.safeParse({
        password: "NuevaClave123!",
        passwordConfirmation: "NuevaClave123!",
      }).success,
    ).toBe(true);
  });

  it("rechaza una contraseña débil antes de enviarla al backend", () => {
    expect(
      passwordSchema.safeParse({
        password: "debil",
        passwordConfirmation: "debil",
      }).success,
    ).toBe(false);
  });

  it("rechaza confirmaciones distintas", () => {
    const result = passwordSchema.safeParse({
      password: "NuevaClave123!",
      passwordConfirmation: "OtraClave123!",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.message === "Las contraseñas no coinciden."),
      ).toBe(true);
    }
  });
});
