import { describe, expect, it } from "vitest";
import { buildAvailableAccesses } from "@/features/access/api/access.service";
import type {
  AppAction,
  GrupoUsuario,
  UsuarioAutenticado,
} from "@/features/auth/api/auth.contracts";

function group(name: string, ...actions: AppAction[]): GrupoUsuario {
  return {
    id: name,
    nombre: name,
    descripcion: null,
    modulos: [
      {
        id: "modulo-" + name,
        nombre: name === "CONFIGURACION" ? "ADMINISTRACION_USUARIOS" : "BITACORA_ATENCIONES",
        descripcion: null,
        acciones: actions.map((action, index) => ({
          id: String(index),
          nombre: action,
          descripcion: null,
        })),
      },
    ],
  };
}
function account(...groups: GrupoUsuario[]): UsuarioAutenticado {
  return {
    id: "test",
    nombre: "Test",
    primer_apellido: "Usuario",
    segundo_apellido: null,
    correo_electronico: "test@example.test",
    curp: "TEST000000HDFXXX00",
    entidad_federativa_id: null,
    numero_telefono: null,
    is_2fa_enabled: true,
    estatus: null,
    instancia: null,
    intentos_login: 0,
    fecha_correo_verificado: null,
    fecha_creacion: "2026-01-01T00:00:00Z",
    fecha_actualizacion: "2026-01-01T00:00:00Z",
    permisos: { grupos: groups },
  };
}
const targets = (user: UsuarioAutenticado) => buildAvailableAccesses(user).map((x) => x.target_app);

describe("accesos independientes Mesa y Configuracion", () => {
  it("un usuario de Mesa no ve Configuracion", () => {
    expect(targets(account(group("MESA_AYUDA", "VER_BITACORA")))).toEqual(["MESA_AYUDA"]);
  });
  it("un usuario de Configuracion no ve Mesa", () => {
    expect(targets(account(group("CONFIGURACION", "VER_USUARIOS")))).toEqual([
      "ADMINISTRACION_SISTEMA",
    ]);
  });
  it("un usuario con acciones en ambos grupos ve ambos", () => {
    expect(
      targets(account(group("MESA_AYUDA", "VER_BITACORA"), group("CONFIGURACION", "VER_USUARIOS"))),
    ).toEqual(["MESA_AYUDA", "ADMINISTRACION_SISTEMA"]);
  });
  it("retirar Configuracion no revoca Mesa", () => {
    expect(targets(account(group("MESA_AYUDA", "VER_BITACORA"), group("CONFIGURACION")))).toEqual([
      "MESA_AYUDA",
    ]);
  });
  it("acciones administrativas heredadas bajo Mesa no autorizan Configuracion", () => {
    expect(targets(account(group("MESA_AYUDA", "SUPER_ADMIN")))).toEqual([]);
  });
  it("SUPER_ADMIN en Configuracion no concede Mesa", () => {
    expect(targets(account(group("CONFIGURACION", "SUPER_ADMIN")))).toEqual([
      "ADMINISTRACION_SISTEMA",
    ]);
  });
});
