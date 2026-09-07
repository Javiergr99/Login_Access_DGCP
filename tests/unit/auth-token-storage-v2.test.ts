import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { authTokenStorage } from "@/features/auth/services/token-storage";

function serializedWebStorage() {
  return JSON.stringify({
    local: Object.entries(localStorage),
    session: Object.entries(sessionStorage),
  });
}

describe("authTokenStorage Auth v2", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    authTokenStorage.clear();
  });

  afterEach(() => {
    authTokenStorage.clear();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("mantiene el access token únicamente en memoria", () => {
    authTokenStorage.save(
      {
        access_token: "access-secret",
        token_type: "bearer",
      },
      true,
    );

    expect(authTokenStorage.getAccessToken()).toBe("access-secret");
    expect(serializedWebStorage()).not.toContain("access-secret");
    expect(localStorage.getItem("mesa-ayuda-session-persistence")).toBe("persistent");
  });

  it("reemplaza el access token sin persistir credenciales", () => {
    authTokenStorage.save({ access_token: "access-a", token_type: "bearer" });
    authTokenStorage.replace({ access_token: "access-b", token_type: "bearer" });

    expect(authTokenStorage.getAccessToken()).toBe("access-b");
    expect(serializedWebStorage()).not.toContain("access-a");
    expect(serializedWebStorage()).not.toContain("access-b");
    expect(serializedWebStorage()).not.toContain("refresh");
  });

  it("limpia el access token y el marcador no sensible", () => {
    authTokenStorage.save(
      {
        access_token: "access-secret",
        token_type: "bearer",
      },
      true,
    );

    authTokenStorage.clear();

    expect(authTokenStorage.getAccessToken()).toBeNull();
    expect(localStorage.getItem("mesa-ayuda-session-persistence")).toBeNull();
    expect(sessionStorage.getItem("mesa-ayuda-session-persistence")).toBeNull();
  });
});
