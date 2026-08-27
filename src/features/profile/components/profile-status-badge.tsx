import { AlertTriangle, CheckCircle2, CircleMinus, XCircle } from "lucide-react";

import type { AccountTone } from "@/features/profile/model/profile.utils";
import { cn } from "@/shared/lib/cn";

type ProfileStatusBadgeProps = {
  label: string;
  tone?: AccountTone;
  compact?: boolean;
};

const toneClasses: Record<AccountTone, string> = {
  success:
    "bg-[var(--color-success-soft)] text-[var(--color-success)] ring-[var(--color-success)]/15",
  warning:
    "bg-[var(--color-warning-soft)] text-[var(--color-warning)] ring-[var(--color-warning)]/15",
  danger: "bg-[var(--color-error-soft)] text-[var(--color-error)] ring-[var(--color-error)]/15",
  neutral:
    "bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] ring-[var(--color-border)]",
};

const toneIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  neutral: CircleMinus,
} satisfies Record<AccountTone, typeof CheckCircle2>;

export function ProfileStatusBadge({
  label,
  tone = "neutral",
  compact = false,
}: ProfileStatusBadgeProps) {
  const Icon = toneIcons[tone];

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full font-semibold-token ring-1 ring-inset",
        toneClasses[tone],
        compact ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs",
      )}
    >
      <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  );
}
