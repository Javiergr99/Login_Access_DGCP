import type {
  AppAction,
  GrupoUsuario,
  UsuarioAutenticado,
} from "../../auth/api/auth.contracts";
const AGENDA_CODE = "CONTROL_AGENDA_NACIONAL";

const CRUD_ACTIONS = [
  "VER_ACCIONES_SEMAFORO",
  "CREAR_ACCION_SEMAFORO",
  "EDITAR_ACCION_SEMAFORO",
  "ELIMINAR_ACCION_SEMAFORO",
] as const;
const DASHBOARD_ACTIONS = ["VER_DASHBOARD_SEMAFORO"] as const;
const ADMIN_ACTIONS = ["ADMINISTRAR_TODO_SEMAFORO"] as const;
const CONSOLIDATED_DG_ACTIONS = [...CRUD_ACTIONS, ...DASHBOARD_ACTIONS] as const;

// Solo el grupo SEMAFORO contiene los cinco módulos autorizables.
const AGENDA_MODULES: Readonly<Record<string, readonly AppAction[]>> = {
  SEMAFORO_ADMIN: ADMIN_ACTIONS,
  SEMAFORO_DGRJRDNNA: CONSOLIDATED_DG_ACTIONS,
  SEMAFORO_DGRCAS: CONSOLIDATED_DG_ACTIONS,
  SEMAFORO_DGNPDDNNA: CONSOLIDATED_DG_ACTIONS,
  SEMAFORO_DGCP: CONSOLIDATED_DG_ACTIONS,
};

export type AgendaAccess = {
  permissions: AppAction[];
  accessLevel: "limited" | "read_only";
};

function validatedActions(group: GrupoUsuario): AppAction[] {
  if (group.nombre !== "SEMAFORO" || !Array.isArray(group.modulos)) return [];

  const actions: AppAction[] = [];
  for (const module of group.modulos) {
    if (!Object.prototype.hasOwnProperty.call(AGENDA_MODULES, module.nombre)) continue;
    const allowedActions = AGENDA_MODULES[module.nombre];
    if (!allowedActions || !Array.isArray(module.acciones)) continue;
    for (const action of module.acciones) {
      if (allowedActions.includes(action.nombre)) actions.push(action.nombre);
    }
  }
  return actions;
}

/** The canonical Auth access is mandatory; groups or SUPER_ADMIN alone never grant Agenda. */
export function resolveAgendaAccess(user: UsuarioAutenticado): AgendaAccess | null {
  const canonical = user.accesos_sistemas?.find((entry) => entry.codigo === AGENDA_CODE);
  if (!canonical || !Array.isArray(canonical.grupos_autorizados) ||
      !canonical.grupos_autorizados.includes("SEMAFORO")) return null;
  const groups = user.permisos?.grupos;
  if (!Array.isArray(groups)) return null;

  const effectiveActions = new Set<AppAction>();
  for (const group of groups) {
    if (group.nombre !== "SEMAFORO") continue;
    for (const action of validatedActions(group)) effectiveActions.add(action);
  }
  if (effectiveActions.size === 0) return null;

  const permissions = Array.from(effectiveActions);
  const canWrite = permissions.some((permission) =>
    permission === "CREAR_ACCION_SEMAFORO" ||
    permission === "EDITAR_ACCION_SEMAFORO" ||
    permission === "ELIMINAR_ACCION_SEMAFORO" ||
    permission === "ADMINISTRAR_TODO_SEMAFORO",
  );

  // "full" would suggest implicit deletion; administrative action alone does not grant that.
  return { permissions, accessLevel: canWrite ? "limited" : "read_only" };
}
