/// <reference types="node" />

import { expect, test, type Page } from "@playwright/test";

import { generateTotp } from "./helpers/totp";

const AUTH_URL = "http://127.0.0.1:5174";
const APP_URL = "http://127.0.0.1:5173";
const API_URL = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";
const REFRESH_COOKIE_NAME = process.env.E2E_REFRESH_COOKIE_NAME ?? "mesa_ayuda_refresh";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Falta la variable ${name}. Usa una cuenta dedicada exclusivamente a E2E.`);
  }

  return value;
}

async function browserStorage(page: Page) {
  return page.evaluate(() => ({
    local: Object.entries(localStorage),
    session: Object.entries(sessionStorage),
  }));
}

function storageAsText(storage: Awaited<ReturnType<typeof browserStorage>>) {
  return JSON.stringify(storage);
}

async function expectNoCredentialTokens(page: Page) {
  const storage = await browserStorage(page);
  const serialized = storageAsText(storage);

  expect(serialized).not.toContain("access_token");
  expect(serialized).not.toContain("refresh_token");
  expect(serialized).not.toMatch(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
}

test("login real, MFA, SSO, refresh y logout", async ({ page, context, request }) => {
  const curp = requiredEnv("E2E_CURP");
  const password = requiredEnv("E2E_PASSWORD");
  const totpSecret = requiredEnv("E2E_TOTP_SECRET");
  const accessTitle = requiredEnv("E2E_ACCESS_TITLE");

  await test.step("comprobar auth_service", async () => {
    const response = await request.get(`${API_URL}/openapi.json`);

    expect(response.ok(), "auth_service debe estar activo antes del E2E.").toBe(true);
  });

  await test.step("iniciar sesion sin persistir el desafio MFA", async () => {
    await page.goto("/login", {
      waitUntil: "domcontentloaded",
    });

    const curpField = page.getByLabel("CURP");

    await expect(curpField).toBeVisible();

    await curpField.fill(curp);

    await page.getByLabel(/^Contrase.a$/i).fill(password);

    await page
      .getByRole("button", {
        name: "Continuar",
      })
      .click();

    await expect(page, "La cuenta E2E debe tener 2FA previamente configurado.").toHaveURL(
      /\/mfa\/verificar/,
    );

    await expect(
      page.getByRole("heading", {
        name: "Verifica tu identidad",
      }),
    ).toBeVisible();

    const storage = await browserStorage(page);

    expect(storage.session.some(([key]) => key === "mesa-ayuda-auth-pending")).toBe(false);

    expect(storageAsText(storage)).not.toContain("tempToken");

    await expectNoCredentialTokens(page);
  });

  await test.step("validar TOTP y cookie HttpOnly", async () => {
    const code = generateTotp(totpSecret);

    for (let index = 0; index < code.length; index += 1) {
      await page.getByLabel(new RegExp(`D.gito ${index + 1} de 6`, "i")).fill(code.charAt(index));
    }

    await page
      .getByRole("button", {
        name: "Verificar identidad",
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Accesos disponibles",
      }),
    ).toBeVisible({
      timeout: 15_000,
    });

    const cookies = await context.cookies(`${API_URL}/auth/refresh`);

    const refreshCookie = cookies.find((cookie) => cookie.name === REFRESH_COOKIE_NAME);

    expect(refreshCookie, "auth_service debe crear la cookie refresh.").toBeDefined();

    expect(refreshCookie?.httpOnly).toBe(true);

    expect(refreshCookie?.path).toBe("/auth");

    await expectNoCredentialTokens(page);
  });

  await test.step("intercambiar redirect-code hacia Mesa de Ayuda", async () => {
    const card = page
      .locator("article")
      .filter({
        hasText: accessTitle,
      })
      .first();

    await expect(card, `No se encontro el acceso "${accessTitle}".`).toBeVisible();

    const enterButton = card.getByRole("button").last();

    await expect(enterButton).toBeEnabled();

    await enterButton.click();

    await expect(page).toHaveURL(/^http:\/\/127\.0\.0\.1:5173\/app\//, {
      timeout: 20_000,
    });

    await expect(page.locator("#app-scroll-container")).toBeVisible({
      timeout: 20_000,
    });

    await expectNoCredentialTokens(page);
  });

  await test.step("restaurar la sesion tras F5 mediante refresh HttpOnly", async () => {
    await page.reload();

    await expect(page.locator("#app-scroll-container")).toBeVisible({
      timeout: 20_000,
    });

    await expect(page).toHaveURL(/^http:\/\/127\.0\.0\.1:5173\/app\//);

    await expectNoCredentialTokens(page);
  });

  await test.step("cerrar la sesion y comprobar revocacion cruzada", async () => {
    await page.goto(`${AUTH_URL}/accesos`);

    await expect(
      page.getByRole("heading", {
        name: "Accesos disponibles",
      }),
    ).toBeVisible({
      timeout: 20_000,
    });

    await page
      .getByRole("button", {
        name: "Abrir opciones del perfil",
      })
      .click();

    await page
      .getByRole("menuitem", {
        name: /Cerrar sesi.n/i,
      })
      .click();

    await expect(page).toHaveURL(/^http:\/\/127\.0\.0\.1:5174\/login/, {
      timeout: 20_000,
    });

    const cookies = await context.cookies(`${API_URL}/auth/refresh`);

    expect(cookies.some((cookie) => cookie.name === REFRESH_COOKIE_NAME)).toBe(false);

    await page.goto(`${APP_URL}/app/dashboard`);

    await expect(page).toHaveURL(/^http:\/\/127\.0\.0\.1:5174\/login/, {
      timeout: 20_000,
    });
  });
});
