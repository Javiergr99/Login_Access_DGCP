import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";
import { Building2, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router";

import { AccessLayout } from "@/components/layout/access-layout";
import { Typography } from "@/components/ui/typography";
import type { UserWithPermissionsRead } from "@/features/auth/api/auth.contracts";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { AdministrativeAccessSummary } from "@/features/profile/components/administrative-access-summary";
import { InformationAlert } from "@/features/profile/components/information-alert";
import { ProfileStatusBadge } from "@/features/profile/components/profile-status-badge";
import { ProfileSummaryCard } from "@/features/profile/components/profile-summary-card";
import { ReadOnlyDataCard } from "@/features/profile/components/read-only-data-card";
import { ReadOnlyDataItem } from "@/features/profile/components/read-only-data-item";
import { SecurityStatusItem } from "@/features/profile/components/security-status-item";
import {
  formatProfileDate,
  getAccountStatusView,
  getAdministrativeAccessLabels,
  getAdministrativeRole,
  getFederalEntityName,
} from "@/features/profile/model/profile.utils";

function ProfileHeader() {
  return (
    <header>
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center gap-1.5 text-[11px] font-medium-token text-[var(--color-text-secondary)]"
      >
        <Link
          to="/accesos"
          className="rounded-sm transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
        >
          Accesos disponibles
        </Link>
        <span aria-hidden="true">›</span>
        <span className="font-semibold-token text-[var(--color-primary)]">Mi perfil</span>
      </nav>
      <Typography as="h1" variant="pageTitle" className="mt-0.5">
        Mi perfil
      </Typography>
      <Typography variant="bodyMuted" className="mt-1 max-w-3xl">
        Consulta tu información personal, institucional y los privilegios administrativos asignados
        a tu cuenta.
      </Typography>
    </header>
  );
}

function GeneralDataCard({ user }: { user: UserWithPermissionsRead }) {
  const entityName = getFederalEntityName(user.entidad_federativa_id);

  return (
    <ReadOnlyDataCard title="Datos generales" icon={UserRound}>
      <dl className="auth-profile-data-grid grid sm:grid-cols-2 lg:grid-cols-3">
        <ReadOnlyDataItem label="Nombre" value={user.nombre} />
        <ReadOnlyDataItem label="Primer apellido" value={user.primer_apellido} />
        <ReadOnlyDataItem
          label="Segundo apellido"
          value={user.segundo_apellido || "No registrado"}
        />
        <ReadOnlyDataItem label="CURP" value={user.curp} />
        <ReadOnlyDataItem label="Correo electrónico" value={user.correo_electronico} />
        <ReadOnlyDataItem
          label="Número de teléfono"
          value={user.numero_telefono || "No registrado"}
        />
        <ReadOnlyDataItem
          label="Entidad federativa"
          value={entityName}
          className="sm:col-span-2 lg:col-span-3"
        />
      </dl>
    </ReadOnlyDataCard>
  );
}

function InstitutionalDataCard({ user }: { user: UserWithPermissionsRead }) {
  const accountStatus = getAccountStatusView(user);
  const entityName = getFederalEntityName(user.entidad_federativa_id);

  return (
    <ReadOnlyDataCard title="Información institucional" icon={Building2}>
      <dl className="auth-profile-data-grid grid sm:grid-cols-2 lg:grid-cols-3">
        <ReadOnlyDataItem label="Institución" value={user.instancia?.nombre || "No registrada"} />
        <ReadOnlyDataItem
          label="Siglas de la institución"
          value={user.instancia?.siglas || "No registradas"}
        />
        <ReadOnlyDataItem label="Entidad federativa" value={entityName} />
        <ReadOnlyDataItem
          label="Estatus de la cuenta"
          value={
            <ProfileStatusBadge label={accountStatus.label} tone={accountStatus.tone} compact />
          }
        />
        <ReadOnlyDataItem label="Identificador del usuario" value={user.id} />
        <ReadOnlyDataItem
          label="Fecha de registro"
          value={formatProfileDate(user.fecha_creacion)}
        />
        <ReadOnlyDataItem
          label="Fecha de última actualización"
          value={formatProfileDate(user.fecha_actualizacion)}
          className="sm:col-span-2 lg:col-span-3"
        />
      </dl>
    </ReadOnlyDataCard>
  );
}

function twoFactorStatus(user: UserWithPermissionsRead) {
  return user.is_2fa_enabled
    ? { label: "2FA activado", tone: "success" as const }
    : { label: "2FA no configurado", tone: "warning" as const };
}

function loginAttemptsStatus(user: UserWithPermissionsRead) {
  return user.intentos_login > 0
    ? { label: `${user.intentos_login} intento(s) fallido(s)`, tone: "warning" as const }
    : { label: "Sin intentos fallidos", tone: "success" as const };
}

function emailStatus(user: UserWithPermissionsRead) {
  return user.fecha_correo_verificado
    ? { label: "Correo verificado", tone: "success" as const }
    : { label: "Correo pendiente", tone: "warning" as const };
}

function SecurityDataCard({ user }: { user: UserWithPermissionsRead }) {
  const accountStatus = getAccountStatusView(user);
  const twoFactor = twoFactorStatus(user);
  const loginAttempts = loginAttemptsStatus(user);
  const email = emailStatus(user);

  return (
    <ReadOnlyDataCard title="Seguridad de la cuenta" icon={ShieldCheck}>
      <div className="auth-profile-data-grid grid sm:grid-cols-2 lg:grid-cols-3">
        <SecurityStatusItem label="Autenticación de dos factores">
          <ProfileStatusBadge label={twoFactor.label} tone={twoFactor.tone} compact />
        </SecurityStatusItem>
        <SecurityStatusItem label="Estado de la cuenta">
          <ProfileStatusBadge label={accountStatus.label} tone={accountStatus.tone} compact />
        </SecurityStatusItem>
        <SecurityStatusItem label="Intentos de inicio de sesión">
          <ProfileStatusBadge label={loginAttempts.label} tone={loginAttempts.tone} compact />
        </SecurityStatusItem>
        <SecurityStatusItem label="Estado del correo electrónico">
          <ProfileStatusBadge label={email.label} tone={email.tone} compact />
        </SecurityStatusItem>
        <SecurityStatusItem label="Fecha de verificación del correo">
          <ProfileStatusBadge
            label={formatProfileDate(user.fecha_correo_verificado)}
            tone={user.fecha_correo_verificado ? "neutral" : "warning"}
            compact
          />
        </SecurityStatusItem>
        <SecurityStatusItem label="Última actualización de seguridad">
          <ProfileStatusBadge
            label={formatProfileDate(user.fecha_actualizacion)}
            tone="neutral"
            compact
          />
        </SecurityStatusItem>
      </div>
    </ReadOnlyDataCard>
  );
}

function AdministrativeAccess({ user }: { user: UserWithPermissionsRead }) {
  const role = getAdministrativeRole(user);
  const permissions = getAdministrativeAccessLabels(user);

  if (!role || permissions.length === 0) return null;
  return <AdministrativeAccessSummary role={role} permissions={permissions} />;
}

function profileMotion(reduceMotion: boolean | null) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 6 },
    transition: { duration: reduceMotion ? 0 : 0.22, ease: "easeOut" as const },
  };
}

function ProfileContent({
  user,
  reduceMotion,
}: {
  user: UserWithPermissionsRead;
  reduceMotion: boolean | null;
}) {
  const motionState = profileMotion(reduceMotion);
  const administrativeRole = getAdministrativeRole(user);

  return (
    <AccessLayout>
      <LazyMotion features={domAnimation}>
        <m.div
          className="mx-auto w-full max-w-[1040px] space-y-4"
          initial={motionState.initial}
          animate={{ opacity: 1, y: 0 }}
          transition={motionState.transition}
        >
          <ProfileHeader />
          <ProfileSummaryCard user={user} />
          <GeneralDataCard user={user} />
          <InstitutionalDataCard user={user} />
          <SecurityDataCard user={user} />
          <AdministrativeAccess user={user} />
          <InformationAlert isAdministrator={Boolean(administrativeRole)} />
        </m.div>
      </LazyMotion>
    </AccessLayout>
  );
}

export function ProfilePage() {
  const reduceMotion = useReducedMotion();
  const user = useAuthStore((state) => state.user);

  if (!user) return null;
  return <ProfileContent user={user} reduceMotion={reduceMotion} />;
}
