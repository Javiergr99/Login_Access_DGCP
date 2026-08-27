import { create } from "zustand";

import type { LoginResponse, UserWithPermissionsRead } from "@/features/auth/api/auth.contracts";

export type SessionStatus = "checking" | "authenticated" | "anonymous";

export type PendingAuthenticationFlow = "setup" | "verify";

export type PendingAuthentication = {
  tempToken: string;
  expiresAt: number;
  flow: PendingAuthenticationFlow;
  rememberSession: boolean;
};

type AuthState = {
  user: UserWithPermissionsRead | null;
  sessionStatus: SessionStatus;
  pendingAuthentication: PendingAuthentication | null;
  setPendingAuthentication: (response: LoginResponse, rememberSession?: boolean) => void;
  setAuthenticatedUser: (user: UserWithPermissionsRead) => void;
  setSessionAnonymous: () => void;
  clearPendingAuthentication: () => void;
  clearAuthentication: () => void;
};

/**
 * El desafío MFA es una credencial temporal y vive únicamente en memoria.
 *
 * Si la página se recarga durante el paso MFA, el usuario vuelve al login y
 * debe iniciar una nueva transacción. Esta decisión evita exponer temp_token a
 * sessionStorage/localStorage ante un posible XSS.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  sessionStatus: "checking",
  pendingAuthentication: null,

  setPendingAuthentication: (response, rememberSession = false) =>
    set({
      user: null,
      sessionStatus: "anonymous",
      pendingAuthentication: {
        tempToken: response.temp_token,
        expiresAt: Date.now() + response.temp_token_expires_in * 1_000,
        flow: response.status === "two_factor_setup_required" ? "setup" : "verify",
        rememberSession,
      },
    }),

  setAuthenticatedUser: (user) =>
    set({
      user,
      sessionStatus: "authenticated",
      pendingAuthentication: null,
    }),

  setSessionAnonymous: () =>
    set({
      user: null,
      sessionStatus: "anonymous",
    }),

  clearPendingAuthentication: () =>
    set({
      pendingAuthentication: null,
    }),

  clearAuthentication: () =>
    set({
      user: null,
      sessionStatus: "anonymous",
      pendingAuthentication: null,
    }),
}));

export function isPendingAuthenticationExpired(pending: PendingAuthentication | null) {
  if (!pending) {
    return true;
  }

  return pending.expiresAt <= Date.now();
}
