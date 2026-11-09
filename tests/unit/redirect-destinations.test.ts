import { describe, expect, it } from "vitest";

import {
  getConfiguredRedirectDestinations,
  getRedirectDestination,
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

  it("valida los destinos configurados en el entorno actual", () => {
    const destinations = getConfiguredRedirectDestinations();

    const expected = REDIRECT_DESTINATION_IDS
      .map(getRedirectDestination)
      .filter((destination) => destination.length > 0);

    expect(destinations).toEqual(expected);
    expect(destinations.length).toBeGreaterThan(0);
    expect(new Set(destinations).size).toBe(destinations.length);

    for (const destination of destinations) {
      expect(() => new URL(destination)).not.toThrow();
      expect(resolveConfiguredRedirectDestination(destination)).toBe(destination);
    }
  });

  it("rechaza destinos que no pertenezcan al registro configurado", () => {
    expect(() => resolveConfiguredRedirectDestination("http://127.0.0.1:5173/app/perfil")).toThrow(
      /ninguna URL configurada/i,
    );
  });
});
