import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { PermissionBadge } from "@/features/access/components/permission-badge";
import type { AccessItem, AccessTone } from "@/features/access/model/access.types";
import { cn } from "@/shared/lib/cn";

const toneClassNames: Record<AccessTone, string> = {
  blue: "access-tone-blue",
  violet: "access-tone-violet",
  emerald: "access-tone-emerald",
  amber: "access-tone-amber",
};

type AccessCardProps = {
  access: AccessItem;
  onViewPermissions: () => void;
  onEnter: () => void;
  isEntering: boolean;
  isNavigationLocked?: boolean;
  animationIndex?: number;
};

function getAccessToneClassName(access: AccessItem): string {
  return access.target_app === "CONTROL_AGENDA_NACIONAL"
    ? "access-tone-cyan"
    : toneClassNames[access.tone];
}

function getAccessCardState(access: AccessItem, isNavigationLocked: boolean, isEntering: boolean) {
  return {
    disabled: access.access_level === "restricted" || (isNavigationLocked && !isEntering),
    remainingPermissions: Math.max(0, access.permissions.length - access.visiblePermissions.length),
  };
}

function getAccessCardMotion(
  reduceMotion: boolean | null,
  disabled: boolean,
  animationIndex: number,
) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 },
    whileHover: disabled || reduceMotion ? undefined : { y: -4, scale: 1.006 },
    whileTap: disabled || reduceMotion ? undefined : { scale: 0.996 },
    transition: {
      duration: reduceMotion ? 0 : 0.24,
      delay: reduceMotion ? 0 : animationIndex * 0.055,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
}

function AccessPermissions({
  access,
  remainingPermissions,
}: {
  access: AccessItem;
  remainingPermissions: number;
}) {
  if (access.visiblePermissions.length === 0) {
    return (
      <ul className="mt-2.5 space-y-1.5" aria-label={`Permisos de ${access.title}`}>
        <li className="text-[11.5px] text-[var(--color-text-muted)]">
          El backend no reportó permisos granulares para este acceso.
        </li>
      </ul>
    );
  }

  return (
    <ul className="mt-2.5 space-y-1.5" aria-label={`Permisos de ${access.title}`}>
      {access.visiblePermissions.map((permission) => (
        <li
          key={permission.code}
          className="flex items-center gap-2 text-[11.5px] text-[var(--color-text-secondary)]"
        >
          <CheckCircle2
            className="h-3.5 w-3.5 shrink-0 text-[var(--color-success)]"
            strokeWidth={2.4}
          />
          <span className="truncate">{permission.label}</span>
        </li>
      ))}
      <AdditionalPermissionCount count={remainingPermissions} />
    </ul>
  );
}

function AdditionalPermissionCount({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <li className="pl-[22px] text-[10.5px] font-medium-token text-[var(--color-text-muted)]">
      +{count} permisos adicionales
    </li>
  );
}

function AccessButtonContent({ access, isEntering }: { access: AccessItem; isEntering: boolean }) {
  if (isEntering) {
    return (
      <>
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Preparando…
      </>
    );
  }

  return (
    <>
      {access.buttonLabel}
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
    </>
  );
}

function getNavigationLockTitle(isNavigationLocked: boolean, isEntering: boolean) {
  return isNavigationLocked && !isEntering
    ? "Espere mientras se prepara el acceso seleccionado."
    : undefined;
}

export function AccessCard({
  access,
  onViewPermissions,
  onEnter,
  isEntering,
  isNavigationLocked = false,
  animationIndex = 0,
}: AccessCardProps) {
  const reduceMotion = useReducedMotion();
  const { disabled, remainingPermissions } = getAccessCardState(
    access,
    isNavigationLocked,
    isEntering,
  );
  const motion = getAccessCardMotion(reduceMotion, disabled, animationIndex);

  return (
    <LazyMotion features={domAnimation}>
      <m.article
        initial={motion.initial}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={motion.whileHover}
        whileTap={motion.whileTap}
        transition={motion.transition}
        className={cn(
          getAccessToneClassName(access),
          "group relative flex min-h-[286px] flex-col overflow-hidden rounded-[var(--radius-lg)] border",
          "border-[var(--color-border)] bg-[var(--color-surface)] p-[18px]",
          "shadow-[var(--shadow-access-card)] transition-[border-color,box-shadow] duration-200",
          "hover:border-[var(--accent-color-border)] hover:shadow-[var(--shadow-card-hover)]",
        )}
      >
        <span
          className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent-color)] opacity-70"
          aria-hidden="true"
        />

        <div className="flex items-start justify-between gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[var(--accent-color-soft)] text-[var(--accent-color)] transition-transform duration-200 group-hover:-rotate-2 group-hover:scale-105">
            <access.icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <PermissionBadge label={access.badgeLabel} tone={access.tone} />
        </div>

        <div className="mt-3 min-w-0">
          <Typography as="h3" variant="cardTitle" className="text-[15px]">
            {access.title}
          </Typography>
          <p className="mt-1 text-[12px] leading-[18px] text-[var(--color-text-secondary)]">
            {access.description}
          </p>
          <div className="mt-1 flex min-w-0 items-center overflow-hidden text-[11px] leading-5 text-[var(--color-text-secondary)]">
            <span className="truncate">{access.modules.join(" · ")}</span>
          </div>
        </div>

        <AccessPermissions access={access} remainingPermissions={remainingPermissions} />

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <button
            type="button"
            onClick={onViewPermissions}
            className="focus-ring rounded-sm text-[11.5px] font-semibold-token text-[var(--accent-color)] underline decoration-[var(--accent-color-decoration)] decoration-1 underline-offset-4 transition hover:opacity-80"
          >
            Ver permisos
          </button>

          <Button
            variant="accent"
            size="sm"
            onClick={onEnter}
            disabled={disabled || isEntering}
            aria-busy={isEntering}
            title={getNavigationLockTitle(isNavigationLocked, isEntering)}
            className="min-w-[104px] text-[12px]"
          >
            <AccessButtonContent access={access} isEntering={isEntering} />
          </Button>
        </div>
      </m.article>
    </LazyMotion>
  );
}
