import { httpClient } from "@/api/http-client";
import type {
  AppAction,
  AppGroup,
  GrupoUsuario,
  RedirectCodeRequest,
  RedirectCodeResponse,
  UsuarioAutenticado,
} from "@/features/auth/api/auth.contracts";
import type { AccessLevel, AvailableAccess } from "@/features/access/model/access.types";
import {
  getRedirectDestination,
  resolveConfiguredRedirectDestination,
} from "@/shared/config/redirect-destinations";

function actionsFromGroups(groups: GrupoUsuario[]): AppAction[] {
  return Array.from(
    new Set(
      groups.flatMap((group) =>
        group.modulos.flatMap((module) => module.acciones.map((action) => action.nombre)),
      ),
    ),
  );
}

function hasGroup(user: UsuarioAutenticado, groupName: AppGroup): boolean {
  return user.permisos.grupos.some((group) => group.nombre === groupName);
}

function groupActions(user: UsuarioAutenticado, groupName: AppGroup): AppAction[] {
  return actionsFromGroups(user.permisos.grupos.filter((group) => group.nombre === groupName));
}

function groupOrSuperAdminActions(
  user: UsuarioAutenticado,
  groupName: AppGroup,
  hasSuperAdmin: boolean,
): AppAction[] {
  const actions = groupActions(user, groupName);

  if (actions.length > 0) {
    return actions;
  }

  return hasSuperAdmin ? ["SUPER_ADMIN"] : [];
}

function levelForMesaAyuda(actions: Set<AppAction>): AccessLevel {
  if (
    actions.has("CREAR_BITACORA") ||
    actions.has("ACTUALIZAR_BITACORA") ||
    actions.has("SUPER_ADMIN")
  ) {
    return "full";
  }

  return actions.has("VER_BITACORA") ? "read_only" : "limited";
}

function levelForFormatos(actions: Set<AppAction>): AccessLevel {
  if (
    actions.has("VALIDAR_FORMATO_ATENCIONES") ||
    actions.has("VER_FORMATOS_RECIBIDOS") ||
    actions.has("SUPER_ADMIN")
  ) {
    return "full";
  }

  if (actions.has("CAPTURAR_FORMATO_ATENCIONES") || actions.has("ACTUALIZAR_FORMATO_DEVUELTO")) {
    return "limited";
  }

  return "read_only";
}

export function buildAvailableAccesses(user: UsuarioAutenticado): AvailableAccess[] {
  const accesses: AvailableAccess[] = [];
  const allActions = new Set(actionsFromGroups(user.permisos.grupos));
  const hasSuperAdmin = allActions.has("SUPER_ADMIN");

  const mesaActions = groupOrSuperAdminActions(user, "MESA_AYUDA", hasSuperAdmin);

  const formatosActions = groupOrSuperAdminActions(user, "FORMATOS_ATENCIONES", hasSuperAdmin);

  if (mesaActions.length > 0) {
    accesses.push({
      id: "mesa-ayuda",
      target_app: "MESA_AYUDA",
      name: "Mesa de Ayuda",
      description:
        "Registre, consulte y dé seguimiento a las solicitudes de atención recibidas en la plataforma.",
      access_level: levelForMesaAyuda(new Set(mesaActions)),
      permissions: mesaActions,
      order: 1,
      target_url: getRedirectDestination("mesaAyuda"),
    });
  }

  if (formatosActions.length > 0) {
    accesses.push({
      id: "formatos-atenciones",
      target_app: "FORMATOS_ATENCIONES",
      name: "Formato NNA Gestión",
      description:
        "Capture, consulte y exporte los formatos de atención asociados a niñas, niños y adolescentes.",
      access_level: levelForFormatos(new Set(formatosActions)),
      permissions: formatosActions,
      order: 2,
      target_url: getRedirectDestination("formatoNna"),
    });
  }

  const hasDirectorioAccess = hasSuperAdmin || hasGroup(user, "DIRECTORIO_PROCURADORES");

  if (hasDirectorioAccess) {
    const directorioActions = groupOrSuperAdminActions(
      user,
      "DIRECTORIO_PROCURADORES",
      hasSuperAdmin,
    );

    accesses.push({
      id: "directorio-procuradores",
      target_app: "DIRECTORIO_PROCURADORES",
      name: "Directorio de Procuradores",
      description:
        "Administre la información institucional de procuradores, directores, asistentes y coordinaciones jurídicas.",
      access_level: hasSuperAdmin ? "full" : "limited",
      permissions: directorioActions,
      order: 3,
      target_url: getRedirectDestination("directorioProcuradores"),
    });
  }

  const hasControlAgendaAccess = hasSuperAdmin || hasGroup(user, "CONTROL_AGENDA_NACIONAL");

  if (hasControlAgendaAccess) {
    const controlAgendaActions = groupOrSuperAdminActions(
      user,
      "CONTROL_AGENDA_NACIONAL",
      hasSuperAdmin,
    );

    accesses.push({
      id: "control-agenda-nacional",
      target_app: "CONTROL_AGENDA_NACIONAL",
      name: "Control Agenda Nacional",
      description:
        "Consulte y gestione la agenda nacional y las actividades institucionales autorizadas.",
      access_level: hasSuperAdmin ? "full" : "limited",
      permissions: controlAgendaActions,
      order: 4,
      target_url: getRedirectDestination("controlAgendaNacional"),
    });
  }

  const administrationActions = Array.from(allActions).filter((action) =>
    [
      "SUPER_ADMIN",
      "ADMINISTRAR_USUARIOS",
      "VER_CATALOGO_PERMISOS",
      "ASIGNAR_GRUPOS_USUARIO",
      "ASIGNAR_MODULOS_USUARIO",
      "ASIGNAR_ACCIONES_USUARIO",
    ].includes(action),
  );

  if (administrationActions.length > 0) {
    accesses.push({
      id: "administracion-sistema",
      target_app: "ADMINISTRACION_SISTEMA",
      name: "Administración del sistema",
      description:
        "Gestione usuarios, grupos, módulos, acciones y permisos dentro de su alcance institucional.",
      access_level: hasSuperAdmin ? "full" : "limited",
      permissions: administrationActions,
      order: 5,
      target_url: getRedirectDestination("administracion"),
    });
  }

  return accesses.sort((left, right) => left.order - right.order);
}

export function resolveConfiguredRedirectUrl(redirectUrl: string): string {
  return resolveConfiguredRedirectDestination(redirectUrl);
}

export async function createRedirectCode(redirectUrl: string): Promise<RedirectCodeResponse> {
  const normalizedRedirectUrl = resolveConfiguredRedirectUrl(redirectUrl);

  const body: RedirectCodeRequest = {
    redirect_url: normalizedRedirectUrl,
  };

  const response = await httpClient.post<RedirectCodeResponse>("/auth/redirect-code", body);

  return response.data;
}
