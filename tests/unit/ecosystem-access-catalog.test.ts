import { describe, expect, it } from "vitest";

import { buildEcosystemAccessCatalog } from "../../src/features/access/model/ecosystem-access-catalog";
import type { AvailableAccess } from "../../src/features/access/model/access.types";

const mesaAyuda: AvailableAccess = {
  id: "mesa-ayuda",
  target_app: "MESA_AYUDA",
  name: "Mesa de Ayuda",
  description: "Sistema de atenciones",
  access_level: "full",
  permissions: ["VER_BITACORA"],
  order: 1,
  target_url: "https://mesa.pfpnna.tech/app/dashboard",
};

const agenda: AvailableAccess = {
  id: "control-agenda-nacional",
  target_app: "CONTROL_AGENDA_NACIONAL",
  name: "Control Agenda Nacional",
  description: "Agenda institucional",
  access_level: "limited",
  permissions: ["VER_DASHBOARD"],
  order: 4,
  target_url: "https://agenda.pfpnna.tech/app/dashboard",
};

describe("ecosystem access catalog", () => {
  it("no muestra tarjetas cuando no hay accesos asignados", () => {
    expect(buildEcosystemAccessCatalog([])).toEqual([]);
  });

  it("muestra solamente el sistema autorizado", () => {
    const result = buildEcosystemAccessCatalog([mesaAyuda]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "mesa-ayuda",
      access_level: "full",
    });
  });

  it("conserva solo los accesos asignados y el orden institucional", () => {
    const result = buildEcosystemAccessCatalog([agenda, mesaAyuda]);

    expect(result.map((access) => access.id)).toEqual(["mesa-ayuda", "control-agenda-nacional"]);
  });

  it("distingue un sistema autorizado pendiente de despliegue", () => {
    const result = buildEcosystemAccessCatalog([{ ...mesaAyuda, target_url: "" }]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "mesa-ayuda",
      access_level: "restricted",
      badgeLabel: "Pendiente de despliegue",
      buttonLabel: "No disponible",
      permissions: ["VER_BITACORA"],
    });
  });
});
