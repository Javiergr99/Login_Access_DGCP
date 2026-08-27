import { Bell } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { UserProfileMenu } from "@/components/layout/user-profile-menu";
import { useAuthStore } from "@/features/auth/model/auth.store";

const formatoNnaPublicUrl =
  import.meta.env.VITE_FORMATO_NNA_PUBLIC_URL?.trim() || "http://127.0.0.1:5176";

const navigationItems = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Por Tus Derechos", href: "#por-tus-derechos" },
  { label: "Micrositio", href: "#micrositio" },
  { label: "Agenda", href: "#agenda" },
  { label: "Formato de Atenciones NNA", href: formatoNnaPublicUrl },
] as const;

/**
 * Encabezado privado de Mesa de Ayuda 2.0.
 * Se utiliza únicamente después de completar la autenticación.
 */
export function AppHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[var(--header-height)] border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-5 px-5 sm:px-6">
        <div className="min-w-0 justify-self-start">
          <Logo to="/accesos" />
        </div>

        <nav
          className="hidden items-center justify-center gap-6 lg:flex"
          aria-label="Navegación superior de Mesa de Ayuda"
        >
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="focus-ring rounded-md px-1 py-2 text-sm font-semibold-token text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex min-w-0 items-center justify-self-end gap-2 sm:gap-3">
          <button
            type="button"
            className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] transition-[background-color,color,transform] duration-150 hover:-translate-y-px hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] active:translate-y-0"
            aria-label="Notificaciones"
          >
            <Bell className="h-[18px] w-[18px]" />
          </button>

          {user ? <UserProfileMenu user={user} /> : null}
        </div>
      </div>
    </header>
  );
}
