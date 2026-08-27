import type { ReactNode } from "react";

import { AuthHero } from "@/components/layout/auth-hero";
import { GobMxFooter } from "@/components/layout/gobmx/gobmx-footer";
import { GobMxHeader } from "@/components/layout/gobmx/gobmx-header";

type AuthLayoutProps = {
  children: ReactNode;
};

/**
 * Layout exclusivo del portal público de autenticación.
 *
 * Incluye:
 * - Header institucional de Gobierno de México.
 * - Panel visual con la imagen NNAS.jpg.
 * - Área de formularios de autenticación.
 * - Footer institucional de Gobierno de México.
 *
 * Este layout no debe utilizarse en la pantalla privada de accesos.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      data-theme="auth"
      className={[
        "flex min-h-screen flex-col",
        "bg-[var(--color-page-background)]",
        "text-[var(--color-text-primary)]",
      ].join(" ")}
    >
      <GobMxHeader />

      <main
        className={[
          "grid flex-1 grid-cols-1",
          "lg:grid-cols-2",
          "lg:min-h-[clamp(660px,70vh,724px)]",
        ].join(" ")}
      >
        <AuthHero />

        <section
          aria-label="Formulario de autenticación"
          className={[
            "flex min-w-0 items-center justify-center",
            "bg-[var(--color-page-background)]",
            "px-4 py-10",
            "sm:px-6 sm:py-12",
            "lg:px-10 lg:py-14",
            "xl:px-14",
          ].join(" ")}
        >
          <div className="w-full max-w-[460px]">{children}</div>
        </section>
      </main>

      <GobMxFooter />
    </div>
  );
}
