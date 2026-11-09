import { useEffect } from "react";
import { authService } from "@/features/auth/api/auth.service";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { env } from "@/shared/config/env";

/**
 * Reconcilia derechos con /users/me al volver a la pestaña y periódicamente.
 * La comprobación final siempre ocurre en Auth /auth/redirect-code.
 */
export function useAccessPermissionRefresh(): void {
  useEffect(() => {
    if (env.enableMocks) return;
    let alive = true;
    let inFlight = false;

    const sync = async () => {
      if (
        !alive || inFlight || document.visibilityState !== "visible" ||
        useAuthStore.getState().sessionStatus !== "authenticated"
      ) return;
      inFlight = true;
      try {
        const user = await authService.getCurrentUser();
        if (alive) useAuthStore.getState().setAuthenticatedUser(user);
      } catch {
        // Los 401 los procesa el cliente de autenticación existente.
        // Un fallo temporal de red no es autorización para entrar.
      } finally {
        inFlight = false;
      }
    };

    const onVisible = () => { void sync(); };
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(onVisible, 30_000);
    return () => {
      alive = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}
