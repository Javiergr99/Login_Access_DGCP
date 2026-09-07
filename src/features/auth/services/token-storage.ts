import type { TokenResponse } from "@/features/auth/api/auth.contracts";
import {
  sessionPersistence,
  type TokenPersistence,
} from "@/features/auth/services/session-persistence";

export type { TokenPersistence } from "@/features/auth/services/session-persistence";

let accessToken: string | null = null;

/**
 * Auth v2: el access token vive exclusivamente en memoria. El refresh token
 * pertenece a una cookie HttpOnly administrada por auth_service y nunca entra
 * al estado ni al almacenamiento JavaScript.
 */
export const authTokenStorage = {
  save(tokens: TokenResponse, rememberSession = false) {
    const persistence: TokenPersistence = rememberSession ? "persistent" : "session";

    accessToken = tokens.access_token;
    sessionPersistence.save(persistence);
  },

  getAccessToken(): string | null {
    return accessToken;
  },

  getPersistence(): TokenPersistence {
    return sessionPersistence.get();
  },

  replace(tokens: TokenResponse) {
    accessToken = tokens.access_token;
  },

  clear() {
    accessToken = null;
    sessionPersistence.clear();
  },
};
