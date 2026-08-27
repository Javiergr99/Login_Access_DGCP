import { UserAvatar } from "@/components/ui/user-avatar";
import { Typography } from "@/components/ui/typography";
import {
  getUserDisplayName,
  getUserStatusLabel,
  isUserActive,
} from "@/features/auth/model/auth.selectors";
import { useAuthStore } from "@/features/auth/model/auth.store";

export function UserPermissionSummary() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  const displayName = getUserDisplayName(user);
  const statusLabel = getUserStatusLabel(user);
  const active = isUserActive(user);

  return (
    <section
      className="flex min-h-[78px] flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 shadow-[var(--shadow-user-summary)] sm:flex-row sm:items-center"
      aria-label="Resumen del usuario autenticado"
    >
      <UserAvatar name={displayName} className="h-11 w-11 text-[11px]" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <Typography as="h2" variant="cardTitle" className="text-[16px]">
            {displayName}
          </Typography>
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold-token leading-none",
              active
                ? "bg-[var(--color-success-soft)] text-[var(--color-success-foreground)]"
                : "bg-[var(--color-warning-soft)] text-[var(--color-warning-foreground)]",
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                active ? "bg-[var(--color-success)]" : "bg-[var(--color-warning)]",
              ].join(" ")}
            />
            {statusLabel}
          </span>
        </div>

        <div className="mt-1.5 grid gap-x-0 gap-y-1.5 text-[12px] text-[var(--color-text-secondary)] md:grid-cols-[auto_minmax(0,1fr)_auto_auto] md:items-center">
          <span className="truncate md:pr-4">{user.correo_electronico}</span>
          <span className="truncate md:border-l md:border-[var(--color-border)] md:px-4">
            {user.instancia?.nombre ?? "Sin instancia asignada"}
          </span>
          <span className="md:border-l md:border-[var(--color-border)] md:px-4">
            CURP: {user.curp}
          </span>
          <span className="md:border-l md:border-[var(--color-border)] md:pl-4">
            2FA: {user.is_2fa_enabled ? "Activado" : "Pendiente"}
          </span>
        </div>
      </div>
    </section>
  );
}
