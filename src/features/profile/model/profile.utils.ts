import type { UserWithPermissionsRead } from "@/features/auth/api/auth.contracts";
import { getUserDisplayName } from "@/features/auth/model/auth.selectors";

const FEDERAL_ENTITIES: Record<number, string> = {
  1: "Aguascalientes",
  2: "Baja California",
  3: "Baja California Sur",
  4: "Campeche",
  5: "Coahuila",
  6: "Colima",
  7: "Chiapas",
  8: "Chihuahua",
  9: "Ciudad de México",
  10: "Durango",
  11: "Guanajuato",
  12: "Guerrero",
  13: "Hidalgo",
  14: "Jalisco",
  15: "Estado de México",
  16: "Michoacán",
  17: "Morelos",
  18: "Nayarit",
  19: "Nuevo León",
  20: "Oaxaca",
  21: "Puebla",
  22: "Querétaro",
  23: "Quintana Roo",
  24: "San Luis Potosí",
  25: "Sinaloa",
  26: "Sonora",
  27: "Tabasco",
  28: "Tamaulipas",
  29: "Tlaxcala",
  30: "Veracruz",
  31: "Yucatán",
  32: "Zacatecas",
};

const PROFILE_DATE_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const ADMINISTRATIVE_ACTION_LABELS: Record<string, string> = {
  ADMINISTRAR_USUARIOS: "Administración de usuarios",
  VER_USUARIOS: "Consulta de usuarios",
  CREAR_USUARIO: "Creación de usuarios",
  ACTUALIZAR_USUARIO: "Actualización de usuarios",
  DESACTIVAR_USUARIO: "Cambio de estatus",
  ASIGNAR_GRUPOS_USUARIO: "Asignación de grupos",
  ASIGNAR_MODULOS_USUARIO: "Asignación de módulos",
  ASIGNAR_ACCIONES_USUARIO: "Asignación de acciones",
  VER_CATALOGO_PERMISOS: "Consulta del catálogo de permisos",
  CREAR_GRUPO: "Creación de grupos",
  ACTUALIZAR_GRUPO: "Actualización de grupos",
  ELIMINAR_GRUPO: "Administración lógica de grupos",
  CREAR_MODULO: "Creación de módulos",
  ACTUALIZAR_MODULO: "Actualización de módulos",
  ELIMINAR_MODULO: "Administración lógica de módulos",
  CREAR_ACCION: "Creación de acciones",
  ACTUALIZAR_ACCION: "Actualización de acciones",
  ELIMINAR_ACCION: "Administración lógica de acciones",
};

export type AccountTone = "success" | "warning" | "danger" | "neutral";

export type AccountStatusView = {
  label: string;
  tone: AccountTone;
};

export function normalizeActionName(value?: string | null): string {
  return value?.trim().toUpperCase() ?? "";
}

export function getUserActionNames(user: UserWithPermissionsRead): string[] {
  return (
    user.permisos?.grupos?.flatMap((group) =>
      (group.modulos ?? []).flatMap((module) =>
        (module.acciones ?? []).map((action) => normalizeActionName(action.nombre)),
      ),
    ) ?? []
  ).filter(Boolean);
}

export function hasAction(user: UserWithPermissionsRead, actionName: string): boolean {
  const actions = new Set(getUserActionNames(user));
  return actions.has(normalizeActionName(actionName));
}

export function isSuperAdmin(user: UserWithPermissionsRead): boolean {
  return hasAction(user, "SUPER_ADMIN");
}

export function getProfileInitials(user: UserWithPermissionsRead): string {
  return [user.nombre, user.primer_apellido, user.segundo_apellido]
    .filter(Boolean)
    .map((part) => part?.trim().charAt(0).toUpperCase())
    .join("")
    .slice(0, 3);
}

export function getFederalEntityName(entityId?: number | null): string {
  if (!entityId) return "No registrada";
  return FEDERAL_ENTITIES[entityId] ?? `Entidad federativa ${entityId}`;
}

export function formatProfileDate(value?: string | null): string {
  if (!value) return "No disponible";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No disponible";

  return PROFILE_DATE_FORMATTER.format(date);
}

export function getAccountStatusView(user: UserWithPermissionsRead): AccountStatusView {
  const statusName = user.estatus?.nombre?.trim() || "Sin estatus";
  const normalized = statusName.toUpperCase();

  if (normalized.includes("ACTIVO") && !normalized.includes("INACTIVO")) {
    return { label: statusName, tone: "success" };
  }

  if (normalized.includes("PROCESO") || normalized.includes("PENDIENTE")) {
    return { label: statusName, tone: "warning" };
  }

  if (
    normalized.includes("BLOQUE") ||
    normalized.includes("EXCESO") ||
    normalized.includes("SUSPEND")
  ) {
    return { label: statusName, tone: "danger" };
  }

  return { label: statusName, tone: "neutral" };
}

export function getAdministrativeRole(user: UserWithPermissionsRead): string | null {
  if (isSuperAdmin(user)) return "SUPER_ADMIN";
  if (hasAction(user, "ADMINISTRAR_USUARIOS")) return "Administrador";
  return null;
}

export function getAdministrativeAccessLabels(user: UserWithPermissionsRead): string[] {
  const actions = new Set(getUserActionNames(user));
  const labels: string[] = [];

  for (const [action, label] of Object.entries(ADMINISTRATIVE_ACTION_LABELS)) {
    if (actions.has(action)) {
      labels.push(label);
    }
  }

  const canRemovePermissions = [
    "QUITAR_GRUPOS_USUARIO",
    "QUITAR_MODULOS_USUARIO",
    "QUITAR_ACCIONES_USUARIO",
  ].some((action) => actions.has(action));

  if (canRemovePermissions) labels.push("Retiro de permisos");
  if (actions.has("SUPER_ADMIN")) labels.push("Administración global");

  return [...new Set(labels)];
}

export function getProfileHeading(user: UserWithPermissionsRead): string {
  return getUserDisplayName(user);
}
