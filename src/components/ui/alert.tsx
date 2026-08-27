import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

import { cn } from "@/shared/lib/cn";

const styles = {
  info: { className: "status-tone-info", icon: Info },
  success: { className: "status-tone-success", icon: CheckCircle2 },
  warning: { className: "status-tone-warning", icon: TriangleAlert },
  error: { className: "status-tone-error", icon: AlertCircle },
} as const;

export type AlertTone = keyof typeof styles;

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  const config = styles[tone];
  const Icon = config.icon;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-[var(--radius-md)] border p-4",
        "border-[var(--status-border)] bg-[var(--status-background)] text-[var(--status-foreground)]",
        config.className,
        className,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--status-icon)]" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-semibold-token">{title}</p>
        {children ? <div className="mt-1 text-sm leading-5 opacity-85">{children}</div> : null}
      </div>
    </div>
  );
}
