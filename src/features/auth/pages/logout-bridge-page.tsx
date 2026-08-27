import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

import { performLogout, type LogoutReason } from "@/features/auth/services/session-security";

function logoutReason(): LogoutReason {
  const reason = new URLSearchParams(window.location.search).get("reason");
  if (reason === "inactivity" || reason === "session-expired") return reason;
  return "manual";
}

export function LogoutBridgePage() {
  useEffect(() => {
    void performLogout(logoutReason());
  }, []);

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--color-page-background)] px-6">
      <div className="flex flex-col items-center text-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        <h1 className="mt-4 text-lg font-bold text-[var(--color-text-primary)]">Cerrando sesión</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Estamos cerrando de forma segura tus sesiones activas.
        </p>
      </div>
    </div>
  );
}
