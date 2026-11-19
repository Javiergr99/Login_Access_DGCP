import { expect, test, type Page } from "@playwright/test";

const ORIGIN = "http://127.0.0.1:4175";
const PREFIX = "/__e2e_api__";

type AccessMode = "allowed" | "empty" | "revoked";

type LocalState = {
  mode: AccessMode;
  userRequests: number;
  refreshRequests: number;
  unexpected: string[];
};

function makeState(): LocalState {
  return {
    mode: "allowed",
    userRequests: 0,
    refreshRequests: 0,
    unexpected: [],
  };
}

function makeUser(withMesaAccess: boolean) {
  return {
    id: "e2e-local-user-001",
    nombre: "Prueba",
    primer_apellido: "Local",
    segundo_apellido: null,
    correo_electronico: "e2e@example.invalid",
    curp: "ZZZZ000101HDFCCC01",
    entidad_federativa_id: null,
    numero_telefono: null,
    is_2fa_enabled: true,
    estatus: null,
    instancia: null,
    intentos_login: 0,
    fecha_correo_verificado: null,
    fecha_creacion: "2026-11-13T00:00:00Z",
    fecha_actualizacion: "2026-11-13T00:00:00Z",
    accesos_sistemas: [],
    permisos: {
      grupos: withMesaAccess
        ? [
            {
              id: "grupo-e2e",
              nombre: "MESA_AYUDA",
              descripcion: null,
              modulos: [
                {
                  id: "modulo-e2e",
                  nombre: "ATENCIONES",
                  descripcion: null,
                  acciones: [
                    {
                      id: "accion-e2e",
                      nombre: "VER_BITACORA",
                      descripcion: null,
                    },
                  ],
                },
              ],
            },
          ]
        : [],
    },
  };
}

async function interceptLocalAuth(page: Page, state: LocalState) {
  // Ninguna solicitud del navegador puede salir
  // a un dominio externo durante esta prueba.
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());

    if (url.origin !== ORIGIN) {
      await route.abort();
      return;
    }

    await route.continue();
  });

  await page.route(`${ORIGIN}${PREFIX}/**`, async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    const respond = async (status: number, data: unknown) => {
      await route.fulfill({
        status,
        contentType: "application/json",
        headers: { "Cache-Control": "no-store" },
        body: JSON.stringify(data),
      });
    };

    if (path === `${PREFIX}/auth/refresh` && request.method() === "POST") {
      state.refreshRequests += 1;

      if (state.mode === "revoked") {
        await respond(401, {
          detail: "Refresh token revocado",
        });
        return;
      }

      await respond(200, {
        access_token: "e2e-local-access-token",
        token_type: "bearer",
      });
      return;
    }

    if (path === `${PREFIX}/users/me` && request.method() === "GET") {
      state.userRequests += 1;

      if (state.mode === "revoked") {
        await respond(401, {
          detail: "Access token revocado",
        });
        return;
      }

      await respond(200, makeUser(state.mode === "allowed"));
      return;
    }

    state.unexpected.push(`${request.method()} ${path}`);

    await respond(503, {
      detail: "Ruta no simulada en E2E local",
    });
  });
}

test("la tarjeta desaparece al recibir permisos actualizados", async ({ page }) => {
  const state = makeState();
  await interceptLocalAuth(page, state);

  await page.goto("/accesos");

  await expect(
    page.getByRole("heading", {
      name: "Accesos disponibles",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "Mesa de Ayuda",
    }),
  ).toBeVisible();

  const requestsBefore = state.userRequests;

  // El Backend simulado retira el acceso.
  state.mode = "empty";

  // Simular que la pestaña recupera el foco.
  await page.evaluate(() => {
    window.dispatchEvent(new Event("focus"));
  });

  await expect.poll(() => state.userRequests).toBeGreaterThan(requestsBefore);

  await expect(
    page.getByRole("heading", {
      name: "Mesa de Ayuda",
    }),
  ).toHaveCount(0);

  await expect(
    page.getByRole("heading", {
      name: "Sin áreas asignadas",
    }),
  ).toBeVisible();

  expect(state.unexpected).toEqual([]);
});

test("la revocacion de JWT cierra la sesion y oculta las tarjetas", async ({ page }) => {
  const state = makeState();
  await interceptLocalAuth(page, state);

  await page.goto("/accesos");

  await expect(
    page.getByRole("heading", {
      name: "Mesa de Ayuda",
    }),
  ).toBeVisible();

  const refreshBefore = state.refreshRequests;

  // Simular la invalidacion del access y refresh token.
  state.mode = "revoked";

  await page.evaluate(() => {
    window.dispatchEvent(new Event("focus"));
  });

  await expect.poll(() => state.refreshRequests).toBeGreaterThan(refreshBefore);

  await expect(page).toHaveURL(/\/login\?reason=session-expired$/);

  await expect(
    page.getByRole("heading", {
      name: "Mesa de Ayuda",
    }),
  ).toHaveCount(0);

  expect(state.unexpected).toEqual([]);
});
