import { Check, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import type { AccessLevel } from "@/features/access/model/access.types";
import type { AccessItem } from "@/features/access/model/access.types";
import { formatPermissionLabel } from "@/features/access/model/permission-labels";

const levelLabels: Record<AccessLevel, string> = {
  full: "Completo",
  limited: "Limitado",
  read_only: "Solo lectura",
  restricted: "Restringido",
};

export function PermissionDialog({
  access,
  open,
  onOpenChange,
}: {
  access: AccessItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!access) return null;

  const permissionCount = access.permissions.length;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Permisos asignados"
      description={`Consulta del alcance disponible para ${access.title}.`}
      className="max-w-2xl"
      footer={
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      }
    >
      <div className="space-y-4">
        <dl className="grid grid-cols-1 gap-3 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3.5 text-sm sm:grid-cols-2 sm:gap-4 sm:p-4">
          <div className="min-w-0">
            <dt className="text-xs font-semibold-token text-[var(--color-text-muted)]">Área</dt>
            <dd className="mt-1 truncate font-semibold-token text-[var(--color-text-primary)]">
              {access.title}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold-token text-[var(--color-text-muted)]">Nivel</dt>
            <dd className="mt-1 font-semibold-token text-[var(--color-text-primary)]">
              {levelLabels[access.access_level]}
            </dd>
          </div>
        </dl>

        <section aria-labelledby="enabled-permissions-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Typography
              as="h3"
              id="enabled-permissions-title"
              variant="bodySm"
              className="font-bold-token"
            >
              Permisos habilitados
            </Typography>
            <span className="rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[11px] font-semibold-token text-[var(--color-primary)]">
              {permissionCount} {permissionCount === 1 ? "permiso" : "permisos"}
            </span>
          </div>

          <ul
            className="mt-3 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2"
            aria-label={`Permisos habilitados para ${access.title}`}
          >
            {permissionCount > 0 ? (
              access.permissions.map((permission) => (
                <li
                  key={permission}
                  className="flex min-w-0 items-center gap-2 rounded-[var(--radius-sm)] px-1 py-1 text-[13px] leading-5 text-[var(--color-text-secondary)]"
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)]">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  <span className="min-w-0 break-words">{formatPermissionLabel(permission)}</span>
                </li>
              ))
            ) : (
              <li className="flex items-center gap-2.5 text-sm text-[var(--color-text-muted)] sm:col-span-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-surface-subtle)]">
                  <Minus className="h-3.5 w-3.5" />
                </span>
                Sin permisos granulares reportados
              </li>
            )}
          </ul>
        </section>

        <Typography
          variant="caption"
          className="border-t border-[var(--color-border-subtle)] pt-3 leading-5"
        >
          Esta pantalla es informativa. La asignación de permisos se realiza desde la administración
          institucional.
        </Typography>
      </div>
    </Dialog>
  );
}
