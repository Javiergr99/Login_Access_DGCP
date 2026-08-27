import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Building2, ChevronDown, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { UserAvatar } from "@/components/ui/user-avatar";
import type { UserWithPermissionsRead } from "@/features/auth/api/auth.contracts";
import {
  getUserDisplayName,
  getUserHeaderSubtitle,
  getUserStatusLabel,
  isUserActive,
} from "@/features/auth/model/auth.selectors";
import { performLogout } from "@/features/auth/services/session-security";
import { cn } from "@/shared/lib/cn";

type UserProfileMenuProps = {
  user: UserWithPermissionsRead;
};

const itemClassName = [
  "group flex cursor-default select-none items-center gap-3 rounded-[10px] px-3 py-2.5",
  "text-[13px] text-[var(--color-text-primary)] outline-none",
  "transition-colors duration-150",
  "data-[highlighted]:bg-[var(--color-surface-muted)]",
].join(" ");

/**
 * Menú contextual del perfil.
 *
 * `modal={false}` evita que Radix bloquee el scroll del documento y retire la
 * barra vertical al abrir el menú. Esto elimina el salto horizontal del body.
 */
export function UserProfileMenu({ user }: UserProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userName = getUserDisplayName(user);
  const subtitle = getUserHeaderSubtitle(user);
  const statusLabel = getUserStatusLabel(user);
  const active = isUserActive(user);

  return (
    <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "focus-ring group flex min-w-0 items-center gap-2.5 rounded-[12px] px-1.5 py-1.5 text-left",
            "transition-[background-color,box-shadow] duration-150",
            "hover:bg-[var(--color-surface-muted)]",
            open && "bg-[var(--color-surface-muted)] shadow-[inset_0_0_0_1px_var(--color-border)]",
          )}
          aria-label="Abrir opciones del perfil"
          aria-expanded={open}
        >
          <UserAvatar name={userName} className="h-9 w-9 text-[11px]" />

          <span className="hidden min-w-0 leading-tight sm:block">
            <strong className="block max-w-[190px] truncate text-[13px] font-bold-token text-[var(--color-text-primary)]">
              {userName}
            </strong>
            <span className="mt-0.5 block max-w-[190px] truncate text-[11px] text-[var(--color-text-secondary)]">
              {subtitle}
            </span>
          </span>

          <ChevronDown
            className={cn(
              "hidden h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)] transition-transform duration-150 sm:block",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="bottom"
          sideOffset={10}
          collisionPadding={12}
          className="profile-menu-content z-[70] w-[304px] rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[0_18px_50px_rgb(15_23_42_/_0.16)]"
        >
          <div className="rounded-[12px] bg-[var(--color-surface-muted)] p-3.5">
            <div className="flex items-center gap-3">
              <UserAvatar name={userName} className="h-11 w-11 text-xs" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[13px] font-bold-token text-[var(--color-text-primary)]">
                    {userName}
                  </p>
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      active ? "bg-[var(--color-success)]" : "bg-[var(--color-warning)]",
                    )}
                    title={statusLabel}
                  />
                </div>
                <p className="mt-0.5 truncate text-[11px] text-[var(--color-text-secondary)]">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-1.5 border-t border-[var(--color-border)] pt-3">
              <p className="flex min-w-0 items-center gap-2 text-[11px] text-[var(--color-text-secondary)]">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.correo_electronico}</span>
              </p>
              <p className="flex min-w-0 items-center gap-2 text-[11px] text-[var(--color-text-secondary)]">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {user.instancia?.nombre ?? "Sin instancia asignada"}
                </span>
              </p>
            </div>
          </div>

          <DropdownMenu.Label className="px-3 pb-1 pt-3 text-[10px] font-semibold-token uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            Cuenta
          </DropdownMenu.Label>

          <DropdownMenu.Item
            onSelect={() => {
              void navigate("/perfil");
            }}
            className={itemClassName}
          >
            <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[var(--color-primary-soft)] text-[var(--color-primary)] transition-transform duration-150 group-data-[highlighted]:scale-105">
              <UserRound className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold-token">Mi perfil</span>
              <span className="block text-[11px] text-[var(--color-text-muted)]">
                Consultar datos de la cuenta
              </span>
            </span>
          </DropdownMenu.Item>

          <DropdownMenu.Item className={itemClassName}>
            <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[var(--color-success-soft)] text-[var(--color-success)] transition-transform duration-150 group-data-[highlighted]:scale-105">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold-token">Seguridad</span>
              <span className="block text-[11px] text-[var(--color-text-muted)]">
                2FA {user.is_2fa_enabled ? "activado" : "pendiente"}
              </span>
            </span>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-2 h-px bg-[var(--color-border)]" />

          <DropdownMenu.Item
            onSelect={() => void performLogout()}
            className={cn(
              itemClassName,
              "text-[var(--color-error)] data-[highlighted]:bg-[var(--color-error-soft)]",
            )}
          >
            <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[var(--color-error-soft)]">
              <LogOut className="h-4 w-4" />
            </span>
            <span className="font-semibold-token">Cerrar sesión</span>
          </DropdownMenu.Item>

          <DropdownMenu.Arrow className="fill-[var(--color-surface)]" width={14} height={7} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
