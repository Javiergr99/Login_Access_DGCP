import { describe, expect, it } from "vitest";

import { buildAvailableAccesses } from "@/features/access/api/access.service";
import type { GrupoUsuario, UsuarioAutenticado } from "@/features/auth/api/auth.contracts";

function createUser(groups: GrupoUsuario[]): UsuarioAutenticado {
  return {
    id: "user-1",
    nombre: "Usuario",
    primer_apellido: "Prueba",
    segundo_apellido: null,
    correo_electronico: "usuario@example.test",
    curp: "TEST000000HDFXXX00",
    entidad_federativa_id: null,
    numero_telefono: null,
    is_2fa_enabled: true,
    estatus: null,
    instancia: null,
    intentos_login: 0,
    fecha_correo_verificado: null,
    fecha_creacion: "2026-08-26T00:00:00Z",
    fecha_actualizacion: "2026-08-26T00:00:00Z",
    permisos: {
      grupos: groups,
    },
  };
}

describe("buildAvailableAccesses", () => {
  it("habilita Directorio y Control Agenda cuando auth_service entrega sus grupos", () => {
    const user = createUser([
      {
        id: "group-directorio",
        nombre: "DIRECTORIO_PROCURADORES",
        descripcion: null,
        modulos: [],
      },
      {
        id: "group-agenda",
        nombre: "CONTROL_AGENDA_NACIONAL",
        descripcion: null,
        modulos: [],
      },
    ]);

    const accesses = buildAvailableAccesses(user);

    expect(accesses.map((access) => access.target_app)).toEqual([
      "DIRECTORIO_PROCURADORES",
      "CONTROL_AGENDA_NACIONAL",
    ]);

    expect(accesses[0]).toMatchObject({
      target_url: "http://127.0.0.1:5177/procuradores",
      access_level: "limited",
      permissions: [],
    });

    expect(accesses[1]).toMatchObject({
      target_url: "http://127.0.0.1:5179/app/dashboard",
      access_level: "limited",
      permissions: [],
    });
  });

  it("otorga los cinco accesos del ecosistema a SUPER_ADMIN", () => {
    const user = createUser([
      {
        id: "group-super-admin",
        nombre: "MESA_AYUDA",
        descripcion: null,
        modulos: [
          {
            id: "module-admin",
            nombre: "ADMINISTRACION_USUARIOS",
            descripcion: null,
            acciones: [
              {
                id: "action-super-admin",
                nombre: "SUPER_ADMIN",
                descripcion: null,
              },
            ],
          },
        ],
      },
    ]);

    const accesses = buildAvailableAccesses(user);

    expect(accesses.map((access) => access.target_app)).toEqual([
      "MESA_AYUDA",
      "FORMATOS_ATENCIONES",
      "DIRECTORIO_PROCURADORES",
      "CONTROL_AGENDA_NACIONAL",
      "ADMINISTRACION_SISTEMA",
    ]);

    expect(accesses.every((access) => access.access_level === "full")).toBe(true);
  });
});
