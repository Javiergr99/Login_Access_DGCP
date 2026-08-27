import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import type { AppTheme } from "@/shared/theme/theme.types";

export type ThemeScopeProps = HTMLAttributes<HTMLDivElement> & {
  theme: AppTheme;
  children: ReactNode;
};

/**
 * Delimita el tema visual de una sección de la aplicación.
 * Todos los componentes internos consumen tokens semánticos del tema activo.
 */
export function ThemeScope({ theme, children, className, ...props }: ThemeScopeProps) {
  return (
    <div data-theme={theme} className={cn(className)} {...props}>
      {children}
    </div>
  );
}
