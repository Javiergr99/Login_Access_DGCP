import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";

import { getFirstFieldError, normalizeApiError } from "@/api/api-error";
import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";
import { Spinner } from "@/components/ui/spinner";
import { useResetPassword } from "@/features/auth/hooks/use-reset-password";
import { passwordSchema, type PasswordFormValues } from "@/features/auth/schemas/password.schema";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const resetMutation = useResetPassword();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", passwordConfirmation: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!token) return;

    setGeneralError(null);
    form.clearErrors();

    try {
      await resetMutation.mutateAsync({
        token,
        password_nueva: values.password,
      });
      setSuccessMessage(
        "Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión con tu nueva contraseña.",
      );
      form.reset();
    } catch (error) {
      const passwordError =
        getFirstFieldError(error, "password_nueva") ?? getFirstFieldError(error, "password");
      if (passwordError) form.setError("password", { message: passwordError });
      const normalized = normalizeApiError(error);

      switch (normalized.status) {
        case 400:
          setGeneralError(
            "El enlace de recuperación no es válido, ya fue utilizado o no puede procesarse.",
          );
          break;

        case 401:
          setGeneralError(
            "El enlace de recuperación expiró o ya no es válido. Solicita apoyo a un administrador para iniciar un nuevo proceso.",
          );
          break;

        case 403:
          setGeneralError("No fue posible autorizar esta solicitud de restablecimiento.");
          break;

        case 404:
          setGeneralError(
            "El enlace de recuperación no es válido o ya no se encuentra disponible.",
          );
          break;

        case 422:
          setGeneralError("Revisa la nueva contraseña e inténtalo nuevamente.");
          break;

        case 429:
          setGeneralError(
            "Se realizaron demasiados intentos. Espera unos minutos antes de volver a intentarlo.",
          );
          break;

        default:
          setGeneralError("No fue posible actualizar la contraseña. Inténtalo nuevamente.");
      }
    }
  });

  return (
    <AuthLayout>
      <AuthCard
        title="Restablecer contraseña"
        description="Define una nueva contraseña para recuperar el acceso a tu cuenta."
        icon={<KeyRound className="h-6 w-6" />}
      >
        {!token ? (
          <div className="space-y-5">
            <Alert tone="error" title="Enlace no válido">
              El enlace no contiene un token de recuperación válido. Solicita apoyo a un
              administrador autorizado para iniciar un nuevo proceso de recuperación.
            </Alert>
            <Button asChild fullWidth size="lg">
              <Link to="/login">Regresar al inicio de sesión</Link>
            </Button>
          </div>
        ) : successMessage ? (
          <div className="space-y-5">
            <Alert tone="success" title="Contraseña actualizada">
              {successMessage}
            </Alert>
            <Button asChild fullWidth size="lg">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={(event) => void onSubmit(event)} noValidate>
            {generalError ? (
              <Alert tone="error" title="No fue posible actualizar la contraseña">
                {generalError}
              </Alert>
            ) : null}

            <PasswordField
              label="Nueva contraseña"
              autoComplete="new-password"
              error={form.formState.errors.password?.message}
              disabled={resetMutation.isPending}
              {...form.register("password")}
            />

            <PasswordField
              label="Confirmar contraseña"
              autoComplete="new-password"
              error={form.formState.errors.passwordConfirmation?.message}
              disabled={resetMutation.isPending}
              {...form.register("passwordConfirmation")}
            />

            <Button type="submit" fullWidth size="lg" disabled={resetMutation.isPending}>
              {resetMutation.isPending ? (
                <>
                  <Spinner /> Actualizando…
                </>
              ) : (
                "Actualizar contraseña"
              )}
            </Button>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
