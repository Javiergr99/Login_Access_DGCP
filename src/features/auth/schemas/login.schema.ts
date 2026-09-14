import { z } from "zod";

/**
 * El contrato actual de auth_service identifica al usuario mediante una CURP
 * de exactamente 18 caracteres. El frontend normaliza el valor, pero no debe
 * imponer una estructura más restrictiva que la aceptada por Backend.
 */
export const loginSchema = z.object({
  curp: z
    .string()
    .trim()
    .toUpperCase()
    .length(18, "La CURP debe contener exactamente 18 caracteres."),
  password: z.string().min(1, "La contraseña es obligatoria."),
  rememberSession: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
