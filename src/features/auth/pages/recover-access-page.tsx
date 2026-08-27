import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { getApiErrorMessage, getFirstFieldError } from "@/api/api-error";
import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TextField } from "@/components/ui/text-field";
import { useRecoverPassword } from "@/features/auth/hooks/use-recover-password";
import {
  recoverPasswordSchema,
  type RecoverPasswordFormValues,
} from "@/features/auth/schemas/recover-password.schema";

export function RecoverAccessPage() {
  const recoverMutation = useRecoverPassword();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const form = useForm<RecoverPasswordFormValues>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setGeneralError(null);
    setSuccessMessage(null);
    form.clearErrors();

    try {
      const response = await recoverMutation.mutateAsync({ email: values.email.trim() });
      setSuccessMessage(response.message);
      form.reset();
    } catch (error) {
      const emailError = getFirstFieldError(error, "email");
      if (emailError) form.setError("email", { message: emailError });
      setGeneralError(getApiErrorMessage(error, "No fue posible enviar las instrucciones."));
    }
  });

  return (
    <AuthLayout>
      <AuthCard
        title="Recuperar acceso"
        description="Ingresa tu correo institucional para recibir instrucciones de recuperación."
        icon={<MailCheck className="h-6 w-6" />}
      >
        <form className="space-y-5" onSubmit={(event) => void onSubmit(event)} noValidate>
          {successMessage ? (
            <Alert tone="success" title="Solicitud recibida">
              {successMessage}
            </Alert>
          ) : null}

          {generalError ? (
            <Alert tone="error" title="No fue posible recuperar el acceso">
              {generalError}
            </Alert>
          ) : null}

          <TextField
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="nombre@institucion.gob.mx"
            leadingIcon={<Mail className="h-[18px] w-[18px]" />}
            error={form.formState.errors.email?.message}
            disabled={recoverMutation.isPending}
            {...form.register("email")}
          />

          <Button type="submit" fullWidth size="lg" disabled={recoverMutation.isPending}>
            {recoverMutation.isPending ? (
              <>
                <Spinner /> Enviando…
              </>
            ) : (
              "Enviar instrucciones"
            )}
          </Button>

          <div className="text-center">
            <Link
              className="focus-ring rounded text-sm font-semibold-token text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              to="/login"
            >
              Regresar al inicio
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
