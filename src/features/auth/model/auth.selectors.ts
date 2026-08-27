import type { UserWithPermissionsRead } from "@/features/auth/api/auth.contracts";

export function getUserDisplayName(user: UserWithPermissionsRead) {
  return [user.nombre, user.primer_apellido, user.segundo_apellido]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ");
}

export function getUserHeaderSubtitle(user: UserWithPermissionsRead) {
  return user.instancia?.siglas || user.correo_electronico;
}

export function getUserStatusLabel(user: UserWithPermissionsRead) {
  return user.estatus?.nombre || "Sin estatus asignado";
}

export function isUserActive(user: UserWithPermissionsRead) {
  return getUserStatusLabel(user).toLocaleLowerCase("es-MX").includes("activ");
}
