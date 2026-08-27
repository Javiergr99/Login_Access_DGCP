import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "@/features/auth/model/auth.store";

describe("auth store: desafío MFA", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    useAuthStore.getState().clearAuthentication();
  });

  it("mantiene el temp token únicamente en memoria", () => {
    useAuthStore.getState().setPendingAuthentication(
      {
        status: "pending_2fa",
        temp_token: "temp-token-solo-memoria",
        temp_token_expires_in: 300,
        two_factor_configured: true,
        message: "Código de verificación requerido.",
      },
      true,
    );

    expect(useAuthStore.getState().pendingAuthentication?.tempToken).toBe(
      "temp-token-solo-memoria",
    );

    expect(sessionStorage.length).toBe(0);

    expect(localStorage.length).toBe(0);
  });
});
