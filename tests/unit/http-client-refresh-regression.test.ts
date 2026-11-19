import axios, {
  AxiosError,
  type AxiosAdapter,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_SESSION_EXPIRED_EVENT } from "@/features/auth/services/auth-events";

const tokenStorageMocks = vi.hoisted(() => ({
  getAccessToken: vi.fn<() => string | null>(),
  getPersistence: vi.fn(() => "persistent" as const),
  replace: vi.fn<(tokens: { access_token: string }) => void>(),
  clear: vi.fn(),
}));

vi.mock("@/features/auth/services/token-storage", () => ({
  authTokenStorage: tokenStorageMocks,
}));

type Outcome = 200 | 401 | 403 | 500 | "network";

let httpClient: AxiosInstance;

let accessToken = "token-anterior";
let outcome: Outcome = 200;
let refreshRejected = false;
let userRequests = 0;
let refreshRequests = 0;
let expiredListener = vi.fn();

const previousAdapter = axios.defaults.adapter;

function responseFor(
  config: Parameters<AxiosAdapter>[0],
  status: number,
  data: unknown,
): AxiosResponse {
  const response: AxiosResponse = {
    config,
    data,
    headers: {},
    status,
    statusText: `HTTP ${status}`,
  };

  if (status >= 400) {
    throw new AxiosError(`HTTP ${status}`, "ERR_BAD_RESPONSE", config, undefined, response);
  }

  return response;
}

const adapter: AxiosAdapter = (config) =>
  Promise.resolve().then(() => {
    const path = config.url?.split("?")[0];

    if (path === "/auth/refresh") {
      refreshRequests += 1;

      if (refreshRejected) {
        return responseFor(config, 401, {
          detail: "Refresh token revocado",
        });
      }

      return responseFor(config, 200, {
        access_token: "token-renovado",
        token_type: "bearer",
      });
    }

    if (path === "/users/me") {
      userRequests += 1;

      if (userRequests === 1) {
        return responseFor(config, 401, {
          detail: "Access token anterior",
        });
      }

      if (outcome === "network") {
        throw new AxiosError("Network Error", "ERR_NETWORK", config);
      }

      return responseFor(config, outcome, {
        resultado: "solicitud-reintentada",
      });
    }

    throw new Error(`Ruta inesperada: ${String(path)}`);
  });

beforeAll(async () => {
  // Ambas instancias Axios del cliente se crean con
  // este adaptador, sin efectuar peticiones reales.
  axios.defaults.adapter = adapter;

  ({ httpClient } = await import("@/api/http-client"));
});

afterAll(() => {
  axios.defaults.adapter = previousAdapter;
});

beforeEach(() => {
  vi.clearAllMocks();

  accessToken = "token-anterior";
  outcome = 200;
  refreshRejected = false;
  userRequests = 0;
  refreshRequests = 0;

  expiredListener = vi.fn();
  window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, expiredListener);

  tokenStorageMocks.getAccessToken.mockImplementation(() => accessToken);

  tokenStorageMocks.replace.mockImplementation((tokens) => {
    accessToken = tokens.access_token;
  });
});

afterEach(() => {
  window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, expiredListener);
});

describe("interceptor HTTP - renovacion y revocacion", () => {
  it("renueva el token y reintenta correctamente", async () => {
    const response = await httpClient.get("/users/me");

    expect(response.status).toBe(200);
    expect(refreshRequests).toBe(1);
    expect(userRequests).toBe(2);
    expect(accessToken).toBe("token-renovado");
    expect(tokenStorageMocks.clear).not.toHaveBeenCalled();
    expect(expiredListener).not.toHaveBeenCalled();
  });

  it.each([403, 500] as const)("conserva la sesion si el reintento devuelve %i", async (status) => {
    outcome = status;

    await expect(httpClient.get("/users/me")).rejects.toBeTruthy();

    expect(refreshRequests).toBe(1);
    expect(userRequests).toBe(2);
    expect(tokenStorageMocks.clear).not.toHaveBeenCalled();
    expect(expiredListener).not.toHaveBeenCalled();
  });

  it("conserva la sesion ante un error de red posterior", async () => {
    outcome = "network";

    await expect(httpClient.get("/users/me")).rejects.toBeTruthy();

    expect(refreshRequests).toBe(1);
    expect(userRequests).toBe(2);
    expect(tokenStorageMocks.clear).not.toHaveBeenCalled();
    expect(expiredListener).not.toHaveBeenCalled();
  });

  it("cierra la sesion cuando falla la renovacion", async () => {
    refreshRejected = true;

    await expect(httpClient.get("/users/me")).rejects.toBeTruthy();

    expect(refreshRequests).toBe(1);
    expect(userRequests).toBe(1);
    expect(tokenStorageMocks.clear).toHaveBeenCalledOnce();
    expect(expiredListener).toHaveBeenCalledOnce();
  });

  it("cierra la sesion ante un segundo 401", async () => {
    outcome = 401;

    await expect(httpClient.get("/users/me")).rejects.toBeTruthy();

    expect(refreshRequests).toBe(1);
    expect(userRequests).toBe(2);
    expect(tokenStorageMocks.clear).toHaveBeenCalledOnce();
    expect(expiredListener).toHaveBeenCalledOnce();
  });
});
