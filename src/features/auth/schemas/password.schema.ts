import { z } from "zod";

export const passwordSchema = z
  .object({
    password: z.string().min(1, "La nueva contraseña es obligatoria."),
    passwordConfirmation: z.string().min(1, "Confirma la nueva contraseña."),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Las contraseñas no coinciden.",
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
