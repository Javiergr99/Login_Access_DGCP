import { GobMxDesktopNav } from "@/components/layout/gobmx/gobmx-desktop-nav";
import { GobMxHeaderLogo } from "@/components/layout/gobmx/gobmx-header-logo";
import { GobMxMobileDrawer } from "@/components/layout/gobmx/gobmx-mobile-drawer";
import { GobMxMobileMenuButton } from "@/components/layout/gobmx/gobmx-mobile-menu-button";
import { useGobMxHeader } from "@/components/layout/gobmx/use-gobmx-header";

/**
 * Header institucional reutilizado de Medidas de Protección 2.0.
 * La implementación conserva el diseño original y utiliza los componentes,
 * estilos y dependencias ya presentes en Mesa de Ayuda Auth 2.0.
 */
export function GobMxHeader() {
  const { isMenuOpen, openMenu, setIsMenuOpen } = useGobMxHeader();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[var(--gobmx-header-background)]">
        <div className="flex min-h-[72px] items-center gap-4 px-4 sm:px-6 md:min-h-[92px] md:px-8 lg:px-16">
          <GobMxHeaderLogo />

          <div className="flex-1" />

          <GobMxDesktopNav />
          <GobMxMobileMenuButton onOpen={openMenu} />
        </div>
      </header>

      <GobMxMobileDrawer open={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </>
  );
}
