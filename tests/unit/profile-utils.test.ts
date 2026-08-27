import { describe, expect, it } from "vitest";

import type { UserWithPermissionsRead } from "@/features/auth/api/auth.contracts";
import {
  getAdministrativeAccessLabels,
  getAdministrativeRole,
  getFederalEntityName,
  getProfileInitials,
} from "@/features/profile/model/profile.utils";

const user: UserWithPermissionsRead = {
  id: "user-1",
  nombre: "Administrador",
  primer_apellido: "General",
  segundo_apellido: "Sistema",
  correo_electronico: "admin@example.gob.mx",
  curp: "AURA000101HDFXXX01",
  entidad_federativa_id: 9,
  numero_telefono: "5500000000",
  is_2fa_enabled: true,
  estatus: { id: 1, nombre: "Activo" },
  instancia: { id: 1, nombre: "SNDIF", siglas: "SNDIF" },
  intentos_login: 0,
  fecha_correo_verificado: null,
  fecha_creacion: "2026-01-01T00:00:00Z",
  fecha_actualizacion: "2026-01-02T00:00:00Z",
  permisos: {
    grupos: [
      {
        id: "group-1",
        nombre: "MESA_AYUDA",
        descripcion: null,
        modulos: [
          {
            id: "module-1",
            nombre: "ADMINISTRACION_USUARIOS",
            descripcion: null,
            acciones: [
              { id: "action-1", nombre: "SUPER_ADMIN", descripcion: null },
              {
                id: "action-2",
                nombre: "VER_USUARIOS",
                descripcion: null,
              },
              {
                id: "action-3",
                nombre: "QUITAR_ACCIONES_USUARIO",
                descripcion: null,
              },
            ],
          },
        ],
      },
    ],
  },
};

describe("profile.utils", () => {
  it("detecta el rol y los accesos administrativos desde permisos.grupos", () => {
    expect(getAdministrativeRole(user)).toBe("SUPER_ADMIN");
    expect(getAdministrativeAccessLabels(user)).toEqual(
      expect.arrayContaining([
        "Consulta de usuarios",
        "Retiro de permisos",
        "Administración global",
      ]),
    );
  });

  it("formatea iniciales y entidad federativa", () => {
    expect(getProfileInitials(user)).toBe("AGS");
    expect(getFederalEntityName(9)).toBe("Ciudad de México");
  });
});
