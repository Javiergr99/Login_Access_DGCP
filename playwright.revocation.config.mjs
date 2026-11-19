import { defineConfig, devices } from "@playwright/test";

const origin = "http://127.0.0.1:4175";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "access-revocation.local.spec.ts",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: origin,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm run build && pnpm exec vite preview --host 127.0.0.1 --port 4175 --strictPort",
    url: origin,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      VITE_ENABLE_MOCKS: "false",
      VITE_API_URL: `${origin}/__e2e_api__`,
      VITE_MESA_AYUDA_URL: `${origin}/mesa`,
      VITE_FORMATO_NNA_URL: `${origin}/formatos`,
      VITE_DIRECTORIO_PROCURADORES_URL: `${origin}/directorio`,
      VITE_CONTROL_AGENDA_URL: `${origin}/agenda`,
      VITE_ADMIN_URL: `${origin}/configuracion`,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
