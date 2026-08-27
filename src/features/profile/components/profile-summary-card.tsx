import { Building2, Mail, ShieldCheck } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { UserWithPermissionsRead } from "@/features/auth/api/auth.contracts";
import { ProfileStatusBadge } from "@/features/profile/components/profile-status-badge";
import {
  getAccountStatusView,
  getAdministrativeRole,
  getProfileHeading,
  getProfileInitials,
} from "@/features/profile/model/profile.utils";

export function ProfileSummaryCard({ user }: { user: UserWithPermissionsRead }) {
  const accountStatus = getAccountStatusView(user);
  const administrativeRole = getAdministrativeRole(user);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-lg font-bold-token text-white shadow-sm ring-4 ring-[var(--color-primary-soft)]">
          {getProfileInitials(user)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="min-w-0 text-lg font-bold-token tracking-tight text-[var(--color-text-primary)]">
              {getProfileHeading(user)}
            </h2>
            {administrativeRole ? (
              <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold-token tracking-wide text-violet-700 ring-1 ring-inset ring-violet-600/10">
                {administrativeRole}
              </span>
            ) : null}
            <ProfileStatusBadge label={accountStatus.label} tone={accountStatus.tone} compact />
          </div>

          <div className="mt-3 flex flex-col gap-2 text-xs text-[var(--color-text-secondary)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{user.correo_electronico}</span>
            </span>
            <span className="hidden h-4 w-px bg-[var(--color-border)] sm:block" />
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {user.instancia
                  ? `${user.instancia.siglas} · ${user.instancia.nombre}`
                  : "Institución no registrada"}
              </span>
            </span>
            <span className="hidden h-4 w-px bg-[var(--color-border)] sm:block" />
            <span className="inline-flex items-center gap-1.5 font-semibold-token text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {user.is_2fa_enabled ? "2FA activado" : "2FA no configurado"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
