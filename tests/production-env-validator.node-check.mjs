import assert from "node:assert/strict";
import test from "node:test";

import {
  parseEnv,
  validateBooleanFalse,
  validateProductionUrl,
} from "../scripts/lib/production-env-validator.mjs";

test("acepta Auth y Mesa en 10.2.5.68", () => {
  assert.deepEqual(validateProductionUrl("VITE_API_URL", "http://10.2.5.68:8001"), []);
  assert.deepEqual(
    validateProductionUrl("VITE_MESA_AYUDA_URL", "http://10.2.5.68:5173/app/dashboard"),
    [],
  );
});

test("rechaza localhost y cualquier 127.x.x.x", () => {
  assert.ok(validateProductionUrl("VITE_API_URL", "http://localhost:8001").length > 0);
  assert.ok(validateProductionUrl("VITE_API_URL", "http://127.20.30.40:8001").length > 0);
});

test("rechaza trailing slash", () => {
  const issues = validateProductionUrl("VITE_API_URL", "http://10.2.5.68:8001/");
  assert.ok(issues.some((issue) => issue.message.includes("slash")));
});

test("rechaza credenciales embebidas", () => {
  const issues = validateProductionUrl("VITE_API_URL", "http://usuario:clave@10.2.5.68:8001");
  assert.ok(issues.some((issue) => issue.message.includes("credenciales")));
});

test("permite destinos futuros vacíos porque aún no están desplegados", () => {
  assert.deepEqual(
    validateProductionUrl("VITE_CONTROL_AGENDA_URL", "", {
      required: false,
    }),
    [],
  );
});

test("exige VITE_ENABLE_MOCKS=false", () => {
  assert.deepEqual(validateBooleanFalse("VITE_ENABLE_MOCKS", "false"), []);
  assert.ok(validateBooleanFalse("VITE_ENABLE_MOCKS", "true").length > 0);
  assert.ok(validateBooleanFalse("VITE_ENABLE_MOCKS", "").length > 0);
});

test("parseEnv conserva las URLs del servidor", () => {
  const env = parseEnv(`
VITE_API_URL=http://10.2.5.68:8001
VITE_MESA_AYUDA_URL=http://10.2.5.68:5173/app/dashboard
VITE_ENABLE_MOCKS=false
  `);

  assert.equal(env.VITE_API_URL, "http://10.2.5.68:8001");
  assert.equal(env.VITE_MESA_AYUDA_URL, "http://10.2.5.68:5173/app/dashboard");
  assert.equal(env.VITE_ENABLE_MOCKS, "false");
});
