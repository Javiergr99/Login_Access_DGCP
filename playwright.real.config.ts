import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath, URL } from "node:url";

const AUTH_URL = "http://127.0.0.1:5174";
const APP_URL = "http://127.0.0.1:5173";
const AUTH_API_URL = process.env.E2E_API_URL ?? "http://127.0.0.1:8001";

const authRoot = fileURLToPath(new URL(".", import.meta.url));

const appRoot = fileURLToPath(new URL("../mesa_de_ayuda/", import.meta.url));

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "auth-real.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: {
    timeout: 12_000,
  },
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: "playwright-report-real",
        open: "never",
      },
    ],
  ],
  use: {
    baseURL: AUTH_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: [
    {
      name: "auth",
      command: "npm run dev -- --strictPort",
      cwd: authRoot,
      url: `${AUTH_URL}/login`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        VITE_ENABLE_MOCKS: "false",
        VITE_API_URL: AUTH_API_URL,
      },
    },
    {
      name: "mesa-ayuda",
      command: "npm run dev -- --strictPort",
      cwd: appRoot,
      url: APP_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        VITE_API_URL: AUTH_API_URL,
        VITE_AUTH_APP_URL: `${AUTH_URL}/login`,
      },
    },
  ],
  projects: [
    {
      name: "chromium-real-auth",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
