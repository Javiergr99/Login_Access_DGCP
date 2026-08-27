import { useEffect } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import { useNavigate } from "react-router";

import { AuthCard } from "@/components/layout/auth-card";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Typography } from "@/components/ui/typography";

export function AuthSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => void navigate("/accesos", { replace: true }), 1800);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <LazyMotion features={domAnimation}>
      <AuthLayout>
        <AuthCard
          title="Identidad verificada"
          description="El acceso fue validado correctamente. Estamos preparando tu espacio de trabajo."
        >
          <div className="flex flex-col items-center py-8 text-center">
            <m.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)]"
            >
              <Check className="h-10 w-10" strokeWidth={2.4} />
            </m.div>
            <Typography variant="bodySm" className="mt-5 font-semibold-token">
              Acceso seguro confirmado
            </Typography>
            <Typography variant="bodyMuted" className="mt-1">
              Cargando permisos y áreas disponibles…
            </Typography>
            <LoaderCircle className="mt-5 h-5 w-5 animate-spin text-[var(--color-primary)]" />
          </div>
        </AuthCard>
      </AuthLayout>
    </LazyMotion>
  );
}
