import { useCallback, useEffect, useState } from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

/**
 * Centraliza el estado del menú institucional móvil.
 * El cierre automático al pasar a escritorio evita conservar un drawer abierto
 * después de un cambio de orientación o de tamaño de ventana.
 */
export function useGobMxHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeMenu();
      }
    };

    mediaQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      mediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [closeMenu]);

  return {
    closeMenu,
    isMenuOpen,
    openMenu,
    setIsMenuOpen,
  };
}
