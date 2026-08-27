import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { normalizeApiError } from "@/api/api-error";
import type { RefreshSessionResponse } from "@/features/auth/api/auth.contracts";
import { AUTH_SESSION_EXPIRED_EVENT } from "@/features/auth/services/auth-events";
import { authTokenStorage } from "@/features/auth/services/token-storage";
import { env } from "@/shared/config/env";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
};

const AUTH_PATHS_WITHOUT_REFRESH = [
  "/auth/login",
  "/auth/setup",
  "/auth/login/2fa",
  "/auth/enable",
  "/auth/refresh",
  "/auth/logout",
  "/auth/recover-password",
  "/auth/reset-password",
  "/users/crear-password",
] as const;

const AUTH_PATHS_WITHOUT_ACCESS_TOKEN = ["/users/crear-password"] as const;

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

let refreshPromise: Promise<RefreshSessionResponse> | null = null;

function requestPath(config: InternalAxiosRequestConfig) {
  const baseUrl = config.baseURL ?? env.apiUrl;
  return new URL(config.url ?? "", baseUrl).pathname;
}

function pathMatches(config: InternalAxiosRequestConfig, paths: readonly string[]) {
  const path = requestPath(config);
  return paths.some((candidate) => path === candidate);
}

function shouldAttemptRefresh(config: RetryableRequestConfig) {
  if (config._authRetry) return false;
  return !pathMatches(config, AUTH_PATHS_WITHOUT_REFRESH);
}

function rememberSessionHeaders() {
  return {
    "X-Remember-Session": authTokenStorage.getPersistence() === "persistent" ? "true" : "false",
  };
}

async function refreshSessionTokens(): Promise<RefreshSessionResponse> {
  if (!authTokenStorage.hasSession()) {
    throw new Error("No existe una sesión renovable.");
  }

  if (!refreshPromise) {
    const refreshToken = authTokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No existe un refresh token para renovar la sesión.");
    }

    refreshPromise = refreshClient
      .post<RefreshSessionResponse>(
        "/auth/refresh",
        { refresh_token: refreshToken },
        { headers: rememberSessionHeaders() },
      )
      .then((response) => {
        authTokenStorage.replace(response.data);
        return response.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  const activeRefresh = refreshPromise;
  if (activeRefresh === null) {
    throw new Error("No fue posible iniciar la renovación de sesión.");
  }

  return activeRefresh;
}

function notifySessionExpired() {
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
}

httpClient.interceptors.request.use((config) => {
  const accessToken = authTokenStorage.getAccessToken();
  const omitAccessToken = pathMatches(config, AUTH_PATHS_WITHOUT_ACCESS_TOKEN);

  if (accessToken && !omitAccessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(normalizeApiError(error));
    }

    const axiosError = error as AxiosError;
    const config = axiosError.config as RetryableRequestConfig | undefined;
    const status = axiosError.response?.status;

    if (status === 401 && config && shouldAttemptRefresh(config) && authTokenStorage.hasSession()) {
      config._authRetry = true;

      try {
        await refreshSessionTokens();
        const accessToken = authTokenStorage.getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return await httpClient(config);
      } catch {
        authTokenStorage.clear();
        notifySessionExpired();
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);
