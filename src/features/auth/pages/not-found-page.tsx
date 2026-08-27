import { Link } from "react-router";

import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Página no encontrada"
        description="La dirección solicitada no existe o ya no está disponible."
      >
        <Button asChild fullWidth>
          <Link to="/login">Volver al inicio</Link>
        </Button>
      </AuthCard>
    </AuthLayout>
  );
}
