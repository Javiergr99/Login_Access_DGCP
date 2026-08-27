import type { AppTheme } from "@/shared/theme/theme.types";

export const APP_THEMES = {
  auth: "auth",
  mesaAyuda: "mesa-ayuda",
} as const satisfies Record<string, AppTheme>;
