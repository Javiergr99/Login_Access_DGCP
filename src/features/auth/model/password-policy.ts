export const PASSWORD_SPECIAL_CHARACTERS = "@$!%*?&._-";

export const PASSWORD_POLICY = {
  minLength: 8,
  uppercasePattern: /[A-Z]/,
  lowercasePattern: /[a-z]/,
  numberPattern: /[0-9]/,
  specialCharacterPattern: /[@$!%*?&._-]/,
} as const;

export type PasswordRequirementKey =
  "minLength" | "uppercase" | "lowercase" | "number" | "specialCharacter";

export type PasswordRequirementResult = Record<PasswordRequirementKey, boolean>;

export type PasswordStrengthLevel =
  "empty" | "very-weak" | "weak" | "medium" | "strong" | "very-strong";

export type PasswordStrength = {
  level: PasswordStrengthLevel;
  label: string;
  score: number;
  total: number;
  requirements: PasswordRequirementResult;
};

export const PASSWORD_REQUIREMENTS: ReadonlyArray<{
  key: PasswordRequirementKey;
  label: string;
}> = [
  {
    key: "minLength",
    label: "8 caracteres o más",
  },
  {
    key: "uppercase",
    label: "Al menos una letra mayúscula",
  },
  {
    key: "lowercase",
    label: "Al menos una letra minúscula",
  },
  {
    key: "number",
    label: "Al menos un número",
  },
  {
    key: "specialCharacter",
    label: "Al menos un carácter especial permitido",
  },
];

export function evaluatePasswordRequirements(password: string): PasswordRequirementResult {
  return {
    minLength: password.length >= PASSWORD_POLICY.minLength,
    uppercase: PASSWORD_POLICY.uppercasePattern.test(password),
    lowercase: PASSWORD_POLICY.lowercasePattern.test(password),
    number: PASSWORD_POLICY.numberPattern.test(password),
    specialCharacter: PASSWORD_POLICY.specialCharacterPattern.test(password),
  };
}

export function getPasswordStrength(password: string): PasswordStrength {
  const requirements = evaluatePasswordRequirements(password);
  const score = Object.values(requirements).filter(Boolean).length;
  const total = PASSWORD_REQUIREMENTS.length;

  if (!password) {
    return {
      level: "empty",
      label: "Sin evaluar",
      score: 0,
      total,
      requirements,
    };
  }

  let level: PasswordStrengthLevel;
  let label: string;

  switch (score) {
    case 5:
      level = "very-strong";
      label = "Muy fuerte";
      break;
    case 4:
      level = "strong";
      label = "Fuerte";
      break;
    case 3:
      level = "medium";
      label = "Media";
      break;
    case 2:
      level = "weak";
      label = "Débil";
      break;
    case 0:
    case 1:
    default:
      level = "very-weak";
      label = "Muy débil";
      break;
  }

  return {
    level,
    label,
    score,
    total,
    requirements,
  };
}

export function isPasswordPolicySatisfied(password: string) {
  const result = evaluatePasswordRequirements(password);
  return Object.values(result).every(Boolean);
}
