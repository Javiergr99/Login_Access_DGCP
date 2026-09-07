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
import type { TwoFactorSetupResponse } from "@/features/auth/api/auth.contracts";
import { MfaVerifyForm } from "@/features/auth/components/mfa-verify-form";
import { useTwoFactorSetup } from "@/features/auth/hooks/use-two-factor-setup";
import { useAuthStore } from "@/features/auth/model/auth.store";

function SetupLoadingState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center text-sm text-[var(--color-text-secondary)]">
      <Spinner />
      <p>Generando la configuración segura de tu autenticador…</p>
    </div>
  );
}

function SetupErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div className="space-y-5">
      <Alert tone="error" title="No fue posible generar el código QR">
        {getApiErrorMessage(error, "No fue posible obtener la configuración de seguridad.")}
      </Alert>
      <Button type="button" fullWidth onClick={onRetry}>
        <RefreshCw className="h-4 w-4" /> Intentar nuevamente
      </Button>
    </div>
  );
}

const setupSteps = [
  "Abre tu aplicación de autenticación.",
  "Selecciona la opción para agregar una cuenta.",
  "Escanea el código QR.",
  "Ingresa el código de seis dígitos generado.",
] as const;

function SetupSteps() {
  return (
    <ol className="space-y-2 text-sm leading-5 text-[var(--color-text-secondary)]">
      {setupSteps.map((item, index) => (
        <li key={item} className="flex gap-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-primary-soft)] text-xs font-bold-token text-[var(--color-primary)]">
            {index + 1}
          </span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function ManualKeyPanel({
  manualKey,
  copied,
  onCopy,
}: {
  manualKey: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="mt-2 flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
      <code className="min-w-0 flex-1 break-all font-mono-token text-xs font-semibold-token text-[var(--color-text-primary)]">
        {manualKey}
      </code>
      <Button
        size="icon"
        variant="secondary"
        onClick={onCopy}
        aria-label="Copiar clave de configuración"
      >
        {copied ? (
          <Check className="h-4 w-4 text-[var(--color-success)]" />
        ) : (
          <Clipboard className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

function ManualKeyControls({ manualKey }: { manualKey: string }) {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(manualKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_800);
    } catch {
      setShowSecret(true);
    }
  };

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => setShowSecret((current) => !current)}>
        ¿No puedes escanear el código? {showSecret ? "Ocultar clave" : "Mostrar clave"}
      </Button>
      {showSecret ? (
        <ManualKeyPanel manualKey={manualKey} copied={copied} onCopy={() => void copySecret()} />
      ) : null}
    </div>
  );
}

function SetupReadyState({ setup }: { setup: TwoFactorSetupResponse }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
        <QrCode value={setup.qr_uri} />
      </div>
      <SetupSteps />
      <ManualKeyControls manualKey={setup.manual_key} />
      <MfaVerifyForm mode="setup" />
    </div>
  );
}

function SetupBody({
  isPending,
  isError,
  error,
  setup,
  onRetry,
}: {
  isPending: boolean;
  isError: boolean;
  error: unknown;
  setup: TwoFactorSetupResponse | undefined;
  onRetry: () => void;
}) {
  if (isPending) return <SetupLoadingState />;
  if (isError) return <SetupErrorState error={error} onRetry={onRetry} />;
  if (setup) return <SetupReadyState setup={setup} />;
  return null;
}

function getSetupRedirect(
  pendingAuthentication: ReturnType<typeof useAuthStore.getState>["pendingAuthentication"],
) {
  if (!pendingAuthentication) return "/login";
  if (pendingAuthentication.flow !== "setup") return "/mfa/verificar";
  return null;
}

export function MfaSetupPage() {
  const pendingAuthentication = useAuthStore((state) => state.pendingAuthentication);
  const tempToken =
    pendingAuthentication?.flow === "setup" ? pendingAuthentication.tempToken : null;
  const setupQuery = useTwoFactorSetup(tempToken);
  const redirect = getSetupRedirect(pendingAuthentication);

  if (redirect) return <Navigate to={redirect} replace />;

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Paso 2 de 2"
        title="Configura la autenticación de dos factores"
        description="Escanea el código QR con Google Authenticator o Microsoft Authenticator."
        icon={<ShieldPlus className="h-6 w-6" />}
      >
        <SetupBody
          isPending={setupQuery.isPending}
          isError={setupQuery.isError}
          error={setupQuery.error}
          setup={setupQuery.data}
          onRetry={() => void setupQuery.refetch()}
        />
      </AuthCard>
    </AuthLayout>
  );
}
