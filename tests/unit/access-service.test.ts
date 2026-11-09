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
  it("Directorio exige grupo explícito y Agenda ignora grupo legado", () => {
    const account = createUser([
      { id: "directorio", nombre: "DIRECTORIO_PROCURADORES", descripcion: null, modulos: [] },
      { id: "legacy", nombre: "CONTROL_AGENDA_NACIONAL", descripcion: null, modulos: [] },
    ]);
    expect(buildAvailableAccesses(account).map((a) => a.target_app)).toEqual([
      "DIRECTORIO_PROCURADORES",
    ]);
  });

  it("SUPER_ADMIN solo habilita Configuracion si no existen acciones funcionales", () => {
    const user = createUser([{
      id: "group-super-admin", nombre: "MESA_AYUDA", descripcion: null,
      modulos: [{
        id: "module-admin", nombre: "ADMINISTRACION_USUARIOS", descripcion: null,
        acciones: [{id: "action-super-admin", nombre: "SUPER_ADMIN", descripcion: null}],
      }],
    }]);
    expect(buildAvailableAccesses(user).map((access) => access.target_app)).toEqual([
      "ADMINISTRACION_SISTEMA",
    ]);
  });
});
