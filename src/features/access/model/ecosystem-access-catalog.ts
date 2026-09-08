import { Building2, CalendarDays, FileText, Headphones, Settings2 } from "lucide-react";

import { mapAvailableAccess } from "@/features/access/model/access.mapper";
import type { AccessItem, AccessTarget } from "@/features/access/model/access.types";

type RawAccess = Parameters<typeof mapAvailableAccess>[0];

type EcosystemAccessDefinition = {
  id: string;
  sourceIds: readonly string[];
  targetApp: AccessTarget;
  order: number;
  title: string;
  description: string;
  modules: string[];
  icon: AccessItem["icon"];
  tone: AccessItem["tone"];
};

const ECOSYSTEM_ACCESS_DEFINITIONS: readonly EcosystemAccessDefinition[] = [
  {
    id: "mesa-ayuda",
    sourceIds: ["mesa-ayuda"],
    targetApp: "MESA_AYUDA",
    order: 1,
    title: "Mesa de Ayuda",
    description:
      "Registre, consulte y dé seguimiento a las solicitudes de atención recibidas en la plataforma.",
    modules: ["Atenciones", "Seguimiento", "Minería", "Organizador"],
    icon: Headphones,
    tone: "blue",
  },
  {
    id: "formatos-atenciones",
    sourceIds: ["formatos-atenciones", "formato-nna", "formato-nna-gestion"],
    targetApp: "FORMATOS_ATENCIONES",
    order: 2,
    title: "Formato NNA Gestión",
    description:
      "Gestione, consulte y dé seguimiento a los formatos de atención de niñas, niños y adolescentes.",
    modules: ["Formatos", "Reportes", "Minería de datos"],
    icon: FileText,
    tone: "violet",
  },
  {
    id: "directorio-procuradores",
    sourceIds: ["directorio-procuradores", "directorio-de-procuradores", "directorio_procuradores"],
    targetApp: "DIRECTORIO_PROCURADORES",
    order: 3,
    title: "Directorio de Procuradores",
    description:
      "Administre la información institucional de procuradores, directores, asistentes y coordinaciones jurídicas.",
    modules: ["Procuradores", "Asistentes", "Historial de cambios"],
    icon: Building2,
    tone: "emerald",
  },
  {
    id: "control-agenda-nacional",
    sourceIds: ["control-agenda-nacional", "agenda-nacional", "control_agenda_nacional"],
    targetApp: "CONTROL_AGENDA_NACIONAL",
    order: 4,
    title: "Control Agenda Nacional",
    description:
      "Consulte y gestione la agenda nacional y las actividades institucionales autorizadas.",
    modules: ["Agenda nacional", "Actividades"],
    icon: CalendarDays,
    tone: "blue",
  },
  {
    id: "configuracion",
    sourceIds: ["configuracion", "administracion-sistema", "administracion-del-sistema"],
    targetApp: "ADMINISTRACION_SISTEMA",
    order: 5,
    title: "Configuración",
    description: "Administre perfiles, usuarios, permisos y configuración general del ecosistema.",
    modules: ["Perfiles", "Usuarios", "Permisos", "Apariencia"],
    icon: Settings2,
    tone: "amber",
  },
] as const;

function restrictedAccess(definition: EcosystemAccessDefinition): AccessItem {
  return {
    id: definition.id,
    target_app: definition.targetApp,
    name: definition.title,
    description: definition.description,
    access_level: "restricted",
    permissions: [],
    order: definition.order,
    target_url: "",
    title: definition.title,
    tone: definition.tone,
    icon: definition.icon,
    modules: definition.modules,
    visiblePermissions: [],
    badgeLabel: "Sin acceso",
    buttonLabel: "Sin acceso",
  };
}

function normalizeAccess(access: AccessItem, definition: EcosystemAccessDefinition): AccessItem {
  if (!access.target_url.trim()) {
    return {
      ...restrictedAccess(definition),
      permissions: access.permissions,
      visiblePermissions: access.visiblePermissions,
      badgeLabel: "Pendiente de despliegue",
      buttonLabel: "No disponible",
    };
  }

  return {
    ...access,
    id: definition.id,
    title: definition.title,
    description: definition.description,
    modules: access.modules.length > 0 ? access.modules : definition.modules,
    icon: definition.icon,
    tone: definition.tone,
  };
}

/**
 * Catálogo visual del Ecosistema Integral DGCP.
 *
 * Las cinco aplicaciones se muestran siempre. El backend continúa siendo la
 * autoridad de autorización: cuando no reporta un acceso, la tarjeta queda
 * visible en estado restringido y no puede iniciar redirect-code.
 */
export function buildEcosystemAccessCatalog(rawAccesses: readonly RawAccess[]): AccessItem[] {
  const mappedAccesses = rawAccesses.map(mapAvailableAccess);

  return ECOSYSTEM_ACCESS_DEFINITIONS.map((definition) => {
    const access = mappedAccesses.find((candidate) => definition.sourceIds.includes(candidate.id));

    return access ? normalizeAccess(access, definition) : restrictedAccess(definition);
  });
}
