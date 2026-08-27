import type { TokenResponse } from "@/features/auth/api/auth.contracts";
import {
  sessionPersistence,
  type TokenPersistence,
} from "@/features/auth/services/session-persistence";

export type { TokenPersistence } from "@/features/auth/services/session-persistence";

const REFRESH_TOKEN_KEY = "mesa-ayuda-refresh-token";

let accessToken: string | null = null;

function storageFor(persistence: TokenPersistence): Storage {
  return persistence === "persistent" ? localStorage : sessionStorage;
}

function clearRefreshToken() {
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function persistRefreshToken(refreshToken: string, persistence: TokenPersistence) {
  clearRefreshToken();
  storageFor(persistence).setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function getStoredRefreshToken(): string | null {
  return storageFor(sessionPersistence.get()).getItem(REFRESH_TOKEN_KEY);
}

/**
 * El access token vive únicamente en memoria para reducir su exposición.
 *
 * auth_service entrega el refresh_token en el cuerpo JSON y los endpoints
 * /auth/refresh y /auth/logout lo reciben también por JSON. Por ello el
 * refresh token se conserva en sessionStorage para una sesión normal y solo
 * pasa a localStorage cuando el usuario solicita mantener la sesión iniciada.
 */
export const authTokenStorage = {
  save(tokens: TokenResponse, rememberSession = false) {
    const persistence: TokenPersistence = rememberSession ? "persistent" : "session";

    accessToken = tokens.access_token;
    sessionPersistence.save(persistence);
    persistRefreshToken(tokens.refresh_token, persistence);
  },

  getAccessToken(): string | null {
    return accessToken;
  },

  getRefreshToken(): string | null {
    return getStoredRefreshToken();
  },

  getPersistence(): TokenPersistence {
    return sessionPersistence.get();
  },

  replace(tokens: TokenResponse) {
    accessToken = tokens.access_token;
    persistRefreshToken(tokens.refresh_token, sessionPersistence.get());
  },

  hasSession(): boolean {
    return Boolean(accessToken) || Boolean(getStoredRefreshToken());
  },

  clear() {
    accessToken = null;
    clearRefreshToken();
    sessionPersistence.clear();
  },
};
