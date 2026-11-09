import { httpClient } from "@/api/http-client";
import { resolveAgendaAccess } from "@/features/access/api/agenda-access";
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

// Solo las acciones funcionales explícitas habilitan tarjetas.
// SUPER_ADMIN es administrativo; no concede Mesa ni Formatos por sí mismo.
const MESA_FUNCTIONAL_ACTIONS = new Set<AppAction>([
  "VER_BITACORA", "CREAR_BITACORA", "ACTUALIZAR_BITACORA", "ELIMINAR_BITACORA",
  "SUBIR_ARCHIVO_BITACORA", "VER_DASHBOARD", "GENERAR_REPORTE_EXCEL", "GENERAR_REPORTE_PDF",
]);
const FORMATOS_FUNCTIONAL_ACTIONS = new Set<AppAction>([
  "CAPTURAR_FORMATO_ATENCIONES", "VER_MIS_FORMATOS_ATENCIONES", "VER_FORMATO_PROPIO",
  "DESCARGAR_COMPROBANTE_FORMATO", "ACTUALIZAR_FORMATO_DEVUELTO",
  "VER_FORMATOS_RECIBIDOS", "VER_DETALLE_FORMATO", "INICIAR_REVISION_FORMATO",
  "DEVOLVER_FORMATO_CORRECCION", "VALIDAR_FORMATO_ATENCIONES",
  "ELIMINAR_FORMATO_ATENCIONES", "VER_DASHBOARD_FORMATOS",
  "VER_ESTADISTICAS_POR_ESTADO", "VER_ESTADISTICAS_POR_MUNICIPIO",
  "VER_ESTADISTICAS_POR_INDICADOR", "VER_ESTADISTICAS_POR_PERIODO",
  "GENERAR_EXCEL_FORMATO_INDIVIDUAL", "GENERAR_EXCEL_FORMATOS_CONSOLIDADO",
  "EXPORTAR_DATOS_FORMATOS",
]);

function functionalGroupActions(
  user: UsuarioAutenticado,
  groupName: AppGroup,
  allowed: ReadonlySet<AppAction>,
): AppAction[] {
  return groupActions(user, groupName).filter((action) => allowed.has(action));
}

function levelForMesaAyuda(actions: Set<AppAction>): AccessLevel {
  if (
    actions.has("CREAR_BITACORA") ||
    actions.has("ACTUALIZAR_BITACORA")
  ) {
    return "full";
  }

  return actions.has("VER_BITACORA") ? "read_only" : "limited";
}

function levelForFormatos(actions: Set<AppAction>): AccessLevel {
  if (
    actions.has("VALIDAR_FORMATO_ATENCIONES") ||
    actions.has("VER_FORMATOS_RECIBIDOS")
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

  const mesaActions = functionalGroupActions(user, "MESA_AYUDA", MESA_FUNCTIONAL_ACTIONS);

  const formatosActions = functionalGroupActions(user, "FORMATOS_ATENCIONES", FORMATOS_FUNCTIONAL_ACTIONS);

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

  const hasDirectorioAccess = hasGroup(user, "DIRECTORIO_PROCURADORES");

  if (hasDirectorioAccess) {
    const directorioActions = groupActions(user, "DIRECTORIO_PROCURADORES");

    accesses.push({
      id: "directorio-procuradores",
      target_app: "DIRECTORIO_PROCURADORES",
      name: "Directorio de Procuradores",
      description:
        "Administre la información institucional de procuradores, directores, asistentes y coordinaciones jurídicas.",
      access_level: "limited",
      permissions: directorioActions,
      order: 3,
      target_url: getRedirectDestination("directorioProcuradores"),
    });
  }

  const agendaAccess = resolveAgendaAccess(user);

  if (agendaAccess) {
    accesses.push({
      id: "control-agenda-nacional",
      target_app: "CONTROL_AGENDA_NACIONAL",
      name: "Control Agenda Nacional",
      description:
        "Consulte y gestione la agenda nacional y las actividades institucionales autorizadas.",
      access_level: agendaAccess.accessLevel,
      permissions: agendaAccess.permissions,
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
