import { queryClient } from "@/app/providers/query-client";
import { authService } from "@/features/auth/api/auth.service";
import { useAuthStore } from "@/features/auth/model/auth.store";
import {
  AUTH_SESSION_CHANNEL,
  AUTH_SESSION_EXPIRED_EVENT,
} from "@/features/auth/services/auth-events";
import { authTokenStorage } from "@/features/auth/services/token-storage";

export type LogoutReason = "manual" | "inactivity" | "session-expired";

function loginUrlForReason(reason: LogoutReason) {
  if (reason === "inactivity") return "/login?reason=inactivity";
  if (reason === "session-expired") return "/login?reason=session-expired";
  return "/login";
}

function broadcastLogout(reason: LogoutReason) {
  if (!("BroadcastChannel" in window)) return;

  const channel = new BroadcastChannel(AUTH_SESSION_CHANNEL);
  channel.postMessage({ type: "logout", reason });
  channel.close();
}

export function clearLocalAuthentication() {
  authTokenStorage.clear();
  useAuthStore.getState().clearAuthentication();
  queryClient.clear();
}

/**
 * Solicita la revocación del refresh token y limpia el estado local aun cuando
 * el backend no responda. Esto evita conservar tokens o una interfaz privada
 * después de una sesión vencida.
 */
export async function performLogout(reason: LogoutReason = "manual"): Promise<void> {
  try {
    await authService.logout();
  } catch {
    // La limpieza local y la redirección son prioritarias.
  } finally {
    clearLocalAuthentication();
    broadcastLogout(reason);
    window.location.replace(loginUrlForReason(reason));
  }
}

export { AUTH_SESSION_CHANNEL, AUTH_SESSION_EXPIRED_EVENT };
