import { useSearchParams } from "react-router";

import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Alert } from "@/components/ui/alert";
import { LoginForm } from "@/features/auth/components/login-form";

const reasonMessages = {
  inactivity: {
    title: "Tu sesión se cerró por inactividad",
    detail: "Ingresa nuevamente para continuar de forma segura.",
  },
  "session-expired": {
    title: "Tu sesión ha expirado",
    detail: "Por seguridad, vuelve a iniciar sesión.",
  },
  "temp-expired": {
    title: "El tiempo de verificación terminó",
    detail: "Inicia sesión nuevamente para generar un nuevo código temporal.",
  },
} as const;

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");
  const message =
    reason && reason in reasonMessages
      ? reasonMessages[reason as keyof typeof reasonMessages]
      : null;

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Acceso seguro"
        title="Iniciar sesión"
        description="Ingresa tu CURP y contraseña para acceder a la plataforma."
      >
        <div className="space-y-5">
          {message ? (
            <Alert tone="info" title={message.title}>
              {message.detail}
            </Alert>
          ) : null}
          <LoginForm />
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
