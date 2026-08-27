import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import { APP_THEMES } from "@/shared/theme/theme.constants";
import { ThemeScope } from "@/shared/theme/theme-scope";

/**
 * Layout privado para la selección de sistemas autorizados.
 * No incorpora el Header ni el Footer de Gobierno de México.
 */
export function AccessLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeScope
      theme={APP_THEMES.mesaAyuda}
      className="min-h-screen overflow-x-clip bg-[var(--color-page-background)] pt-[var(--header-height)]"
    >
      <AppHeader />
      <main className="mx-auto w-full max-w-[1180px] px-4 pb-10 pt-6 sm:px-6 lg:px-7">
        {children}
      </main>
    </ThemeScope>
  );
}
