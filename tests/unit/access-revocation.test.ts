import { describe, expect, it } from "vitest";
import { buildAvailableAccesses } from "@/features/access/api/access.service";
import type { GrupoUsuario, UsuarioAutenticado } from "@/features/auth/api/auth.contracts";

function user(...groups: GrupoUsuario[]): UsuarioAutenticado {
  return {
    id: "test", nombre: "Test", primer_apellido: "User", segundo_apellido: null,
    correo_electronico: "test@example.test", curp: "TEST000000HDFXXX00",
    entidad_federativa_id: null, numero_telefono: null, is_2fa_enabled: true,
    estatus: null, instancia: null, intentos_login: 0, fecha_correo_verificado: null,
    fecha_creacion: "2026-01-01T00:00:00Z", fecha_actualizacion: "2026-01-01T00:00:00Z",
    permisos: { grupos: groups },
  };
}
function group(name: string, ...actions: string[]): GrupoUsuario {
  return {
    id: name, nombre: name, descripcion: null,
    modulos: [{
      id: "module-" + name, nombre: name === "SEMAFORO" ? "SEMAFORO_DGCP" : "TEST",
      descripcion: null,
      acciones: actions.map((name, id) => ({id: String(id), nombre: name as never, descripcion: null})),
    }],
  };
}

describe("revocacion de accesos sin excepcion por rango", () => {
  it("SUPER_ADMIN no habilita Mesa, Formatos ni Directorio", () => {
    const accesses = buildAvailableAccesses(user(group("MESA_AYUDA", "SUPER_ADMIN")));
    expect(accesses.map((a) => a.target_app)).toEqual(["ADMINISTRACION_SISTEMA"]);
  });
  it("un permiso funcional habilita Mesa, pero retirarlo desaparece la tarjeta", () => {
    expect(buildAvailableAccesses(user(group("MESA_AYUDA", "VER_BITACORA"))).map(a => a.target_app)).toEqual(["MESA_AYUDA"]);
    expect(buildAvailableAccesses(user(group("MESA_AYUDA")))).toEqual([]);
  });
  it("el grupo Directorio deja de habilitar al retirarlo", () => {
    expect(buildAvailableAccesses(user(group("DIRECTORIO_PROCURADORES"))).some(a=>a.target_app==="DIRECTORIO_PROCURADORES")).toBe(true);
    expect(buildAvailableAccesses(user()).some(a=>a.target_app==="DIRECTORIO_PROCURADORES")).toBe(false);
  });
  it("los grupos historicos SEMAFORO no dan acceso", () => {
    expect(buildAvailableAccesses(user(group("SEMAFORO_DGCP", "VER_ACCIONES_SEMAFORO")))).toEqual([]);
  });
  it("SEMAFORO solo con permisos canonicos da acceso a Agenda", () => {
    const account = user(group("SEMAFORO", "VER_ACCIONES_SEMAFORO"));
    account.accesos_sistemas = [{codigo:"CONTROL_AGENDA_NACIONAL",grupos_autorizados:["SEMAFORO"]}];
    expect(buildAvailableAccesses(account).map(a => a.target_app)).toEqual(["CONTROL_AGENDA_NACIONAL"]);
    account.accesos_sistemas = [];
    expect(buildAvailableAccesses(account)).toEqual([]);
  });
});
