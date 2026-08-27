import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { Spinner } from "@/components/ui/spinner";
import { isPendingAuthenticationExpired, useAuthStore } from "@/features/auth/model/auth.store";

function RouteLoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[var(--color-page-background)]">
      <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
        <Spinner /> Verificando sesión…
      </div>
    </div>
  );
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const sessionStatus = useAuthStore((state) => state.sessionStatus);

  if (sessionStatus === "checking") return <RouteLoadingScreen />;
  if (sessionStatus === "authenticated") return <Navigate to="/accesos" replace />;
  return children;
}

export function PendingMfaRoute({ children }: { children: ReactNode }) {
  const sessionStatus = useAuthStore((state) => state.sessionStatus);
  const pendingAuthentication = useAuthStore((state) => state.pendingAuthentication);

  if (sessionStatus === "checking") return <RouteLoadingScreen />;
  if (sessionStatus === "authenticated") return <Navigate to="/accesos" replace />;

  if (isPendingAuthenticationExpired(pendingAuthentication)) {
    return <Navigate to="/login?reason=temp-expired" replace />;
  }

  return children;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const sessionStatus = useAuthStore((state) => state.sessionStatus);

  if (sessionStatus === "checking") return <RouteLoadingScreen />;
  return sessionStatus === "authenticated" ? children : <Navigate to="/login" replace />;
}
