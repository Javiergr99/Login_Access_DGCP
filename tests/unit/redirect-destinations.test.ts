import { describe, expect, it } from "vitest";

import {
  getConfiguredRedirectDestinations,
  REDIRECT_DESTINATION_IDS,
  resolveConfiguredRedirectDestination,
} from "@/shared/config/redirect-destinations";

describe("redirect destinations", () => {
  it("registra las cinco aplicaciones internas del ecosistema", () => {
    expect(REDIRECT_DESTINATION_IDS).toEqual([
      "mesaAyuda",
      "formatoNna",
      "directorioProcuradores",
      "controlAgendaNacional",
      "administracion",
    ]);
  });

  it("expone las cinco URLs exactas acordadas para redirect-code", () => {
    expect(getConfiguredRedirectDestinations()).toEqual([
      "http://127.0.0.1:5173/app/dashboard",
      "http://127.0.0.1:5175/app/dashboard",
      "http://127.0.0.1:5177/procuradores",
      "http://127.0.0.1:5179/app/dashboard",
      "http://127.0.0.1:5180/app/dashboard",
    ]);
  });

  it("rechaza destinos que no pertenezcan al registro configurado", () => {
    expect(() => resolveConfiguredRedirectDestination("http://127.0.0.1:5173/app/perfil")).toThrow(
      /ninguna URL configurada/i,
    );
  });
});
