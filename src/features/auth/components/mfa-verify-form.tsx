import { useEffect, useMemo, useState } from "react";
import { Clock3, HelpCircle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

import { getApiErrorMessage } from "@/api/api-error";
import { queryClient } from "@/app/providers/query-client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import { Spinner } from "@/components/ui/spinner";
import { authKeys } from "@/features/auth/api/auth.keys";
import { useEnableTwoFactor } from "@/features/auth/hooks/use-enable-two-factor";
import { useVerifyTwoFactor } from "@/features/auth/hooks/use-verify-two-factor";
import { useAuthStore } from "@/features/auth/model/auth.store";

const DEFAULT_TEMP_TOKEN_EXPIRES_IN_SECONDS = 300;

function formatRemainingTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function MfaVerifyForm({ mode = "verify" }: { mode?: "verify" | "setup" }) {
  const navigate = useNavigate();
  const pendingAuthentication = useAuthStore((state) => state.pendingAuthentication);
  const setAuthenticatedUser = useAuthStore((state) => state.setAuthenticatedUser);
  const clearPendingAuthentication = useAuthStore((state) => state.clearPendingAuthentication);
  const verifyMutation = useVerifyTwoFactor();
  const enableMutation = useEnableTwoFactor();
  const mutation = mode === "setup" ? enableMutation : verifyMutation;
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const hasValidExpiration = Boolean(
    pendingAuthentication && Number.isFinite(pendingAuthentication.expiresAt),
  );

  const remainingSeconds = useMemo(() => {
    if (!pendingAuthentication) return 0;

    if (!Number.isFinite(pendingAuthentication.expiresAt)) {
      return DEFAULT_TEMP_TOKEN_EXPIRES_IN_SECONDS;
    }

    return Math.max(0, Math.ceil((pendingAuthentication.expiresAt - now) / 1_000));
  }, [now, pendingAuthentication]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!pendingAuthentication) return;
    if (!hasValidExpiration) return;
    if (remainingSeconds > 0) return;

    clearPendingAuthentication();
    void navigate("/login?reason=temp-expired", { replace: true });
  }, [
    clearPendingAuthentication,
    hasValidExpiration,
    navigate,
    pendingAuthentication,
    remainingSeconds,
  ]);

  const submit = async () => {
    if (!pendingAuthentication) {
      void navigate("/login", { replace: true });
      return;
    }

    if (hasValidExpiration && remainingSeconds <= 0) {
      clearPendingAuthentication();
      void navigate("/login?reason=temp-expired", { replace: true });
      return;
    }

    if (code.length !== 6) {
      setError("Ingrese los seis dígitos del código de verificación.");
      return;
    }

    setError(null);

    try {
      const user = await mutation.mutateAsync({
        temp_token: pendingAuthentication.tempToken,
        code,
      });

      queryClient.setQueryData(authKeys.currentUser(), user);
      setAuthenticatedUser(user);
      void navigate("/acceso-correcto", { replace: true });
    } catch (mutationError) {
      setError(getApiErrorMessage(mutationError, "No fue posible validar el código."));
    }
  };

  const returnToLogin = () => {
    clearPendingAuthentication();
    void navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-5">
      {error ? (
        <Alert tone="error" title="Código no válido">
          {error}
        </Alert>
      ) : null}

      <OtpInput
        value={code}
        onChange={(nextCode) => {
          setCode(nextCode);
          if (error) setError(null);
        }}
        disabled={mutation.isPending}
        error={error ?? undefined}
      />

      <div className="status-tone-info flex gap-2.5 rounded-[var(--radius-md)] border border-[var(--status-border)] bg-[var(--status-background)] p-3.5 text-xs leading-5 text-[var(--status-foreground)]">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-icon)]" />
        <div>
          <p>
            Los códigos cambian periódicamente. Mantén la fecha y hora de tu dispositivo
            configuradas automáticamente.
          </p>
          <p className="mt-1 font-semibold-token">
            Tiempo restante del proceso: {formatRemainingTime(remainingSeconds)}
          </p>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        fullWidth
        onClick={() => void submit()}
        disabled={
          mutation.isPending || code.length !== 6 || (hasValidExpiration && remainingSeconds <= 0)
        }
      >
        {mutation.isPending ? (
          <>
            <Spinner /> Validando código…
          </>
        ) : mode === "setup" ? (
          "Verificar y continuar"
        ) : (
          "Verificar identidad"
        )}
      </Button>

      <div className="flex flex-col items-center gap-3 text-center text-sm">
        <button
          type="button"
          onClick={returnToLogin}
          className="focus-ring rounded font-semibold-token text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          Regresar al inicio
        </button>
        <button
          type="button"
          className="focus-ring inline-flex items-center gap-1.5 rounded text-xs font-semibold-token text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
        >
          <HelpCircle className="h-3.5 w-3.5" /> Tengo problemas con mi código
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
        <ShieldCheck className="h-3.5 w-3.5" /> Compatible con Google Authenticator y Microsoft
        Authenticator
      </div>
    </div>
  );
}
