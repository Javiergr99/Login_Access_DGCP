import { KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { AuthLayout } from "@/components/layout/auth-layout";
import {
  CreatePasswordRequestError,
  type CreatePasswordResponse,
} from "../api/create-password.api";
import {
  ActivationStatusCard,
  type ActivationStatusVariant,
} from "../components/activation-status-card";
import { CreatePasswordForm } from "../components/create-password-form";
import { useCreatePassword } from "../hooks/use-create-password";
import type { CreatePasswordFormValues } from "../schemas/create-password.schema";

const LOGIN_PATH = "/login";

type TerminalState = {
  variant: Exclude<ActivationStatusVariant, "missing-token">;
  message?: string;
} | null;

function removeActivationTokenFromAddressBar() {
  // El token deja de ser útil en estados terminales y no debe conservarse
  // innecesariamente en la entrada actual del historial.
  window.history.replaceState(window.history.state, "", window.location.pathname);
}

export function CreatePasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createPassword = useCreatePassword();
  const [terminalState, setTerminalState] = useState<TerminalState>(null);

  const token = searchParams.get("token")?.trim() ?? "";

  function goToLogin() {
    void navigate(LOGIN_PATH, { replace: true });
  }

  async function handleCreatePassword(values: CreatePasswordFormValues) {
    if (!token || createPassword.isPending) {
      return;
    }

    try {
      const response: CreatePasswordResponse = await createPassword.mutateAsync({
        token,
        password: values.password,
      });

      removeActivationTokenFromAddressBar();
      setTerminalState({
        variant: "success",
        message: response.message || "Contraseña creada correctamente. Ya puedes iniciar sesión.",
      });
    } catch (error) {
      if (!(error instanceof CreatePasswordRequestError)) {
        return;
      }

      if (error.kind === "invalid-token") {
        removeActivationTokenFromAddressBar();
        setTerminalState({
          variant: "invalid-token",
          message: error.message,
        });
        return;
      }

      if (error.kind === "already-configured") {
        removeActivationTokenFromAddressBar();
        setTerminalState({
          variant: "already-configured",
          message: error.message,
        });
      }
    }
  }

  const formError =
    createPassword.error &&
    createPassword.error.kind !== "invalid-token" &&
    createPassword.error.kind !== "already-configured"
      ? createPassword.error.message
      : null;

  return (
    <AuthLayout>
      <main className="flex w-full flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="w-full max-w-[500px]">
          {terminalState ? (
            <ActivationStatusCard
              variant={terminalState.variant}
              message={terminalState.message}
              onGoToLogin={goToLogin}
            />
          ) : !token ? (
            <ActivationStatusCard variant="missing-token" onGoToLogin={goToLogin} />
          ) : (
            <section
              aria-labelledby="create-password-title"
              className="w-full rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.10)] sm:p-7 lg:p-8"
            >
              <header className="mb-6">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_9%,white)] text-[var(--color-primary)] ring-1 ring-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]">
                    <KeyRound aria-hidden="true" className="h-[19px] w-[19px]" />
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
                      Activación de cuenta
                    </p>

                    <h1
                      id="create-password-title"
                      className="mt-1 text-[24px] font-bold leading-tight tracking-[-0.02em] text-slate-950 sm:text-[26px]"
                    >
                      Crear contraseña
                    </h1>
                  </div>
                </div>

                <p className="mt-4 text-[13px] leading-5.5 text-slate-600 sm:text-sm sm:leading-6">
                  Configura la contraseña que utilizarás para ingresar a tu cuenta de Mesa de Ayuda
                  2.0.
                </p>

                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_12%,#e2e8f0)] bg-[color-mix(in_srgb,var(--color-primary)_4%,white)] px-3.5 py-3">
                  <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]"
                  />
                  <p className="text-[12px] leading-5 text-slate-600">
                    El enlace es personal y de un solo uso. Tu contraseña no se mostrará ni se
                    almacenará en esta página.
                  </p>
                </div>
              </header>

              <CreatePasswordForm
                isSubmitting={createPassword.isPending}
                serverError={formError}
                onClearServerError={createPassword.reset}
                onSubmit={handleCreatePassword}
              />
            </section>
          )}
        </div>
      </main>
    </AuthLayout>
  );
}

export default CreatePasswordPage;
