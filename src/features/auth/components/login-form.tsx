import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fingerprint, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { getApiErrorMessage, getFirstFieldError } from "@/api/api-error";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox-field";
import { PasswordField } from "@/components/ui/password-field";
import { Spinner } from "@/components/ui/spinner";
import { TextField } from "@/components/ui/text-field";
import { useLogin } from "@/features/auth/hooks/use-login";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login.schema";

function normalizeCurp(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase().slice(0, 18);
}

export function LoginForm() {
  const navigate = useNavigate();
  const setPendingAuthentication = useAuthStore((state) => state.setPendingAuthentication);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      curp: "",
      password: "",
      rememberSession: false,
    },
  });

  const curpField = form.register("curp");

  const onSubmit = form.handleSubmit(async (values) => {
    setGeneralError(null);
    form.clearErrors();

    try {
      const response = await loginMutation.mutateAsync({
        curp: normalizeCurp(values.curp),
        password: values.password,
        remember_session: values.rememberSession,
      });

      setPendingAuthentication(response, values.rememberSession);
      void navigate(
        response.status === "two_factor_setup_required" ? "/mfa/configurar" : "/mfa/verificar",
        { replace: true },
      );
    } catch (error) {
      const curpError = getFirstFieldError(error, "curp") ?? getFirstFieldError(error, "username");
      const passwordError = getFirstFieldError(error, "password");

      if (curpError) form.setError("curp", { message: curpError });
      if (passwordError) form.setError("password", { message: passwordError });

      setGeneralError(getApiErrorMessage(error, "No fue posible iniciar sesión."));
    }
  });

  return (
    <form className="space-y-4" onSubmit={(event) => void onSubmit(event)} noValidate>
      {generalError ? (
        <Alert tone="error" title="No fue posible iniciar sesión">
          {generalError}
        </Alert>
      ) : null}

      <TextField
        label="CURP"
        type="text"
        autoComplete="username"
        autoCapitalize="characters"
        spellCheck={false}
        maxLength={18}
        placeholder="Ingresa tu CURP"
        leadingIcon={<Fingerprint className="h-[18px] w-[18px]" />}
        error={form.formState.errors.curp?.message}
        disabled={loginMutation.isPending}
        className="uppercase"
        {...curpField}
        onChange={(event) => {
          const normalized = normalizeCurp(event.currentTarget.value);
          event.currentTarget.value = normalized;
          void curpField.onChange(event);
        }}
      />

      <PasswordField
        label="Contraseña"
        autoComplete="current-password"
        placeholder="Ingresa tu contraseña"
        error={form.formState.errors.password?.message}
        disabled={loginMutation.isPending}
        {...form.register("password")}
      />

      <div className="flex items-center justify-between gap-3 pt-1">
        <CheckboxField
          id="remember-session"
          label="Mantener mi sesión iniciada"
          checked={form.watch("rememberSession")}
          onCheckedChange={(checked) =>
            form.setValue("rememberSession", checked, { shouldDirty: true })
          }
        />

        <Link
          to="/recuperar-acceso"
          className="focus-ring shrink-0 rounded text-[13px] font-semibold-token text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button type="submit" size="lg" fullWidth disabled={loginMutation.isPending} className="mt-2">
        {loginMutation.isPending ? (
          <>
            <Spinner /> Verificando…
          </>
        ) : (
          "Continuar"
        )}
      </Button>

      <div className="flex gap-3 pt-5 text-[12px] leading-[1.55] text-[var(--color-text-secondary)]">
        <ShieldCheck className="mt-0.5 h-[17px] w-[17px] shrink-0" />
        <p>Por seguridad, nunca compartas tus credenciales ni tus códigos de verificación.</p>
      </div>
    </form>
  );
}
