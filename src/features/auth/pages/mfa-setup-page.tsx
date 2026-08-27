import { useState } from "react";
import { Check, Clipboard, RefreshCw, ShieldPlus } from "lucide-react";
import { Navigate } from "react-router";

import { getApiErrorMessage } from "@/api/api-error";
import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { QrCode } from "@/components/ui/qr-code";
import { Spinner } from "@/components/ui/spinner";
import { MfaVerifyForm } from "@/features/auth/components/mfa-verify-form";
import { useTwoFactorSetup } from "@/features/auth/hooks/use-two-factor-setup";
import { useAuthStore } from "@/features/auth/model/auth.store";

export function MfaSetupPage() {
  const pendingAuthentication = useAuthStore((state) => state.pendingAuthentication);
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);
  const tempToken =
    pendingAuthentication?.flow === "setup" ? pendingAuthentication.tempToken : null;
  const setupQuery = useTwoFactorSetup(tempToken);

  if (!pendingAuthentication) {
    return <Navigate to="/login" replace />;
  }

  if (pendingAuthentication.flow !== "setup") {
    return <Navigate to="/mfa/verificar" replace />;
  }

  const setup = setupQuery.data;

  const copySecret = async () => {
    if (!setup?.manual_key) return;

    try {
      await navigator.clipboard.writeText(setup.manual_key);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_800);
    } catch {
      setShowSecret(true);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Paso 2 de 2"
        title="Configura la autenticación de dos factores"
        description="Escanea el código QR con Google Authenticator o Microsoft Authenticator."
        icon={<ShieldPlus className="h-6 w-6" />}
      >
        {setupQuery.isPending ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center text-sm text-[var(--color-text-secondary)]">
            <Spinner />
            <p>Generando la configuración segura de tu autenticador…</p>
          </div>
        ) : setupQuery.isError ? (
          <div className="space-y-5">
            <Alert tone="error" title="No fue posible generar el código QR">
              {getApiErrorMessage(
                setupQuery.error,
                "No fue posible obtener la configuración de seguridad.",
              )}
            </Alert>
            <Button type="button" fullWidth onClick={() => void setupQuery.refetch()}>
              <RefreshCw className="h-4 w-4" /> Intentar nuevamente
            </Button>
          </div>
        ) : setup ? (
          <div className="space-y-6">
            <div className="flex justify-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
              <QrCode value={setup.qr_uri} />
            </div>

            <ol className="space-y-2 text-sm leading-5 text-[var(--color-text-secondary)]">
              {[
                "Abre tu aplicación de autenticación.",
                "Selecciona la opción para agregar una cuenta.",
                "Escanea el código QR.",
                "Ingresa el código de seis dígitos generado.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-primary-soft)] text-xs font-bold-token text-[var(--color-primary)]">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ol>

            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSecret((current) => !current)}
              >
                ¿No puedes escanear el código? {showSecret ? "Ocultar clave" : "Mostrar clave"}
              </Button>

              {showSecret ? (
                <div className="mt-2 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
                  <code className="min-w-0 flex-1 break-all font-mono-token text-xs font-semibold-token text-[var(--color-text-primary)]">
                    {setup.manual_key}
                  </code>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => void copySecret()}
                    aria-label="Copiar clave de configuración"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-[var(--color-success)]" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ) : null}
            </div>

            <MfaVerifyForm mode="setup" />
          </div>
        ) : null}
      </AuthCard>
    </AuthLayout>
  );
}
