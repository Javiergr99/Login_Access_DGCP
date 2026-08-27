import { describe, expect, it } from "vitest";

import { appendRedirectExchangeParams, normalizeRedirectUrl } from "@/shared/lib/redirect-url";

describe("redirect-url", () => {
  it("normaliza únicamente la diagonal final de una URL autorizada", () => {
    expect(normalizeRedirectUrl("http://127.0.0.1:5173/app/dashboard/")).toBe(
      "http://127.0.0.1:5173/app/dashboard",
    );
  });

  it("rechaza rutas relativas para evitar usar el origen del Login Universal", () => {
    expect(() => normalizeRedirectUrl("/app/dashboard")).toThrow(/debe ser absoluta/i);
  });

  it("rechaza parámetros y fragmentos antes de solicitar redirect-code", () => {
    expect(() => normalizeRedirectUrl("http://127.0.0.1:5173/app/dashboard?code=abc")).toThrow(
      /parámetros de consulta/i,
    );

    expect(() => normalizeRedirectUrl("http://127.0.0.1:5173/app/dashboard#detalle")).toThrow(
      /fragmentos/i,
    );
  });

  it("agrega el código temporal solo después de autorizar el destino limpio", () => {
    expect(
      appendRedirectExchangeParams({
        redirectUrl: "http://127.0.0.1:5173/app/dashboard",
        code: "redirect-code-1",
        persistence: "session",
      }),
    ).toBe("http://127.0.0.1:5173/app/dashboard?code=redirect-code-1&persistence=session");
  });
});
