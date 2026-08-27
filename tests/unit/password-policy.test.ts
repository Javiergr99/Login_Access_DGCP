import { describe, expect, it } from "vitest";

import {
  evaluatePasswordRequirements,
  getPasswordStrength,
  isPasswordPolicySatisfied,
} from "../../src/features/auth/model/password-policy";

describe("password-policy", () => {
  it("acepta una contraseña que cumple el contrato", () => {
    expect(isPasswordPolicySatisfied("Prueba123!")).toBe(true);
  });

  it("rechaza contraseñas sin carácter especial permitido", () => {
    const result = evaluatePasswordRequirements("Prueba123");

    expect(result.specialCharacter).toBe(false);
    expect(isPasswordPolicySatisfied("Prueba123")).toBe(false);
  });

  it("rechaza contraseñas sin mayúscula", () => {
    expect(isPasswordPolicySatisfied("prueba123!")).toBe(false);
  });

  it("rechaza contraseñas sin minúscula", () => {
    expect(isPasswordPolicySatisfied("PRUEBA123!")).toBe(false);
  });

  it("rechaza contraseñas sin número", () => {
    expect(isPasswordPolicySatisfied("PruebaABC!")).toBe(false);
  });

  it("marca como muy fuerte una contraseña que cumple los cinco requisitos", () => {
    const strength = getPasswordStrength("Prueba123!");

    expect(strength.score).toBe(5);
    expect(strength.label).toBe("Muy fuerte");
  });
});
