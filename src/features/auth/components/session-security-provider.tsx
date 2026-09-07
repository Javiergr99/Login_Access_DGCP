import { useEffect, type ReactNode } from "react";

import { queryClient } from "@/app/providers/query-client";
import { authKeys } from "@/features/auth/api/auth.keys";
import { authService } from "@/features/auth/api/auth.service";
import { useAuthStore } from "@/features/auth/model/auth.store";
import {
  AUTH_SESSION_CHANNEL,
  AUTH_SESSION_EXPIRED_EVENT,
  clearLocalAuthentication,
  performLogout,
} from "@/features/auth/services/session-security";
import { authTokenStorage } from "@/features/auth/services/token-storage";

const INACTIVITY_LIMIT_MS = 60 * 60 * 1_000;
const activityEvents: Array<keyof WindowEventMap> = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
];

type SessionMessage = {
  type?: "logout";
  reason?: "manual" | "inactivity" | "session-expired";
};

export function SessionSecurityProvider({ children }: { children: ReactNode }) {
  const sessionStatus = useAuthStore((state) => state.sessionStatus);
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      if (useAuthStore.getState().sessionStatus !== "checking") {
        return;
      }

      try {
        if (!authTokenStorage.getAccessToken()) {
          await authService.refreshSession();
        }

        const user = await authService.getCurrentUser();

        if (cancelled) return;

        queryClient.setQueryData(authKeys.currentUser(), user);
        setAuthenticatedUser(user);
      } catch {
        if (cancelled) return;
        clearLocalAuthentication();
      }
    };

    void bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [setAuthenticatedUser]);

  useEffect(() => {
    const onSessionExpired = () => {
      const state = useAuthStore.getState();
      const wasAuthenticated = state.sessionStatus === "authenticated";

      clearLocalAuthentication();

      if (wasAuthenticated) {
        window.location.replace("/login?reason=session-expired");
      }
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onSessionExpired);
  }, []);

  useEffect(() => {
    if (!("BroadcastChannel" in window)) {
      return;
    }

    const channel = new BroadcastChannel(AUTH_SESSION_CHANNEL);

    const onMessage = (event: MessageEvent<SessionMessage>) => {
      if (event.data.type !== "logout") {
        return;
      }

      clearLocalAuthentication();
      const reason = event.data.reason ?? "manual";
      const destination =
        reason === "inactivity"
          ? "/login?reason=inactivity"
          : reason === "session-expired"
            ? "/login?reason=session-expired"
            : "/login";

      window.location.replace(destination);
    };

    channel.addEventListener("message", onMessage);

    return () => {
      channel.removeEventListener("message", onMessage);
      channel.close();
    };
  }, []);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    let timeoutId = 0;

    const scheduleLogout = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        void performLogout("inactivity");
      }, INACTIVITY_LIMIT_MS);
    };

    for (const eventName of activityEvents) {
      window.addEventListener(eventName, scheduleLogout, { passive: true });
    }

    scheduleLogout();

    return () => {
      window.clearTimeout(timeoutId);
      for (const eventName of activityEvents) {
        window.removeEventListener(eventName, scheduleLogout);
      }
    };
  }, [sessionStatus]);

  return children;
}
