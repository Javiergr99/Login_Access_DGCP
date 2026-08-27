import type { LucideIcon } from "lucide-react";

import type { AppAction, AppGroup } from "@/features/auth/api/auth.contracts";

export type AccessTarget =
  AppGroup | "DIRECTORIO_PROCURADORES" | "CONTROL_AGENDA_NACIONAL" | "ADMINISTRACION_SISTEMA";
export type AccessLevel = "full" | "limited" | "read_only" | "restricted";
export type AccessTone = "blue" | "violet" | "emerald" | "amber";

export type AvailableAccess = {
  id: string;
  target_app: AccessTarget;
  name: string;
  description: string;
  access_level: AccessLevel;
  permissions: AppAction[];
  order: number;
  target_url: string;
};

export type AccessItem = AvailableAccess & {
  title: string;
  tone: AccessTone;
  icon: LucideIcon;
  modules: string[];
  visiblePermissions: Array<{
    code: AppAction;
    label: string;
  }>;
  badgeLabel: string;
  buttonLabel: string;
};

export type AccessVisualMetadata = {
  title: string;
  tone: AccessTone;
  icon: LucideIcon;
  modules: string[];
};
