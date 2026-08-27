import { z } from "zod";

import { PASSWORD_POLICY } from "../model/password-policy";

export const createPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        PASSWORD_POLICY.minLength,
        `La contraseña debe tener al menos ${PASSWORD_POLICY.minLength} caracteres.`,
      )
      .regex(
        PASSWORD_POLICY.uppercasePattern,
        "La contraseña debe contener al menos una letra mayúscula.",
      )
      .regex(
        PASSWORD_POLICY.lowercasePattern,
        "La contraseña debe contener al menos una letra minúscula.",
      )
      .regex(PASSWORD_POLICY.numberPattern, "La contraseña debe contener al menos un número.")
      .regex(
        PASSWORD_POLICY.specialCharacterPattern,
        "La contraseña debe contener al menos un carácter especial permitido.",
      ),
    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

export type CreatePasswordFormValues = z.infer<typeof createPasswordSchema>;
