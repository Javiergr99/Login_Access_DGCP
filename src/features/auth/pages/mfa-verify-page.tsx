import { ShieldCheck } from "lucide-react";
import { Navigate } from "react-router";

import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { MfaVerifyForm } from "@/features/auth/components/mfa-verify-form";
import { useAuthStore } from "@/features/auth/model/auth.store";

export function MfaVerifyPage() {
  const pendingAuthentication = useAuthStore((state) => state.pendingAuthentication);

  if (!pendingAuthentication) {
    return <Navigate to="/login" replace />;
  }

  if (pendingAuthentication.flow === "setup") {
    return <Navigate to="/mfa/configurar" replace />;
  }

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Paso 2 de 2"
        title="Verifica tu identidad"
        description="Ingresa el código de seis dígitos generado por tu aplicación de autenticación."
        icon={<ShieldCheck className="h-6 w-6" />}
      >
        <MfaVerifyForm />
      </AuthCard>
    </AuthLayout>
  );
}
