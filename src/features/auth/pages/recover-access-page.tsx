import { MailCheck } from "lucide-react";
import { Link } from "react-router";

import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";

export function RecoverAccessPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Recuperar acceso"
        description="Solicita apoyo para iniciar el proceso de recuperación de tu cuenta."
        icon={<MailCheck className="h-6 w-6" />}
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Recuperación mediante un administrador autorizado
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              La solicitud automática de recuperación no está disponible actualmente desde este
              portal. Contacta al administrador responsable para que inicie el proceso de
              recuperación de tu cuenta.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Una vez iniciado el proceso, recibirás en el correo asociado a tu cuenta un enlace
              temporal para establecer una nueva contraseña.
            </p>
          </div>

          <Button asChild fullWidth size="lg">
            <Link to="/login">Regresar al inicio de sesión</Link>
          </Button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
