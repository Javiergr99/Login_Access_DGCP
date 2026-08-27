import { z } from "zod";

export const recoverPasswordSchema = z.object({
  email: z.email("Ingrese un correo electrónico válido."),
});

export type RecoverPasswordFormValues = z.infer<typeof recoverPasswordSchema>;
