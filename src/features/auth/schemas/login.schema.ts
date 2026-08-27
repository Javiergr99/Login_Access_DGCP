import { z } from "zod";

/**
 * Validación estructural de CURP para el acceso.
 *
 * El backend conserva la validación definitiva contra la base de datos.
 * En frontend se valida longitud y estructura básica para evitar enviar
 * correos electrónicos u otros identificadores al campo `username` OAuth2.
 */
const CURP_PATTERN = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i;

export const loginSchema = z.object({
  curp: z
    .string()
    .trim()
    .length(18, "La CURP debe contener exactamente 18 caracteres.")
    .regex(CURP_PATTERN, "Ingresa una CURP con formato válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
  rememberSession: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
