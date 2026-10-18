import { Link } from "react-router";

import { MobileAccessNavigation } from "@/components/layout/mobile-access-navigation";
import { UserProfileMenu } from "@/components/layout/user-profile-menu";
import { Logo } from "@/components/ui/logo";
import { useAuthStore } from "@/features/auth/model/auth.store";

const formatoNnaPublicUrl = import.meta.env.VITE_FORMATO_NNA_PUBLIC_URL?.trim() || "";

const navClassName =
  "focus-ring rounded-md px-1 py-2 text-sm font-semibold-token text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]";

export function AppHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[var(--header-height)] border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex h-full min-w-0 items-center justify-between gap-2 px-3 sm:px-6 xl:gap-5">
        <div className="min-w-0 shrink">
          <Logo to="/accesos" compactOnMobile />
        </div>

        <nav
          className="hidden min-w-0 items-center justify-center gap-5 xl:flex"
          aria-label="Navegación superior del ecosistema"
        >
          <Link to="/accesos" className={navClassName}>
            Accesos disponibles
          </Link>

          <Link to="/perfil" className={navClassName}>
            Mi perfil
          </Link>

          {formatoNnaPublicUrl ? (
            <a href={formatoNnaPublicUrl} className={navClassName}>
              Formato de Atenciones NNA
            </a>
          ) : null}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {user ? <UserProfileMenu user={user} /> : null}

          <MobileAccessNavigation publicFormatUrl={formatoNnaPublicUrl} />
        </div>
      </div>
    </header>
  );
}
