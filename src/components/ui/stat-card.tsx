import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/shared/lib/cn";

const toneClasses = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  slate: "bg-slate-100 text-slate-600",
} as const;

type StatCardTone = keyof typeof toneClasses;

export function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  trend,
  tone = "blue",
}: {
  title: string;
  value: string;
  detail: string;
  icon?: LucideIcon;
  trend?: string;
  tone?: StatCardTone;
}) {
  return (
    <Card className="min-h-[112px] p-4 transition-colors hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <p className="m-0 text-[11px] font-semibold leading-5 text-[var(--nna-text-secondary)]">
          {title}
        </p>
        {Icon ? (
          <span
            className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", toneClasses[tone])}
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
        ) : null}
      </div>
      <p className="mb-0 mt-2.5 text-[26px] font-bold leading-none tracking-tight text-[var(--nna-text-primary)]">
        {value}
      </p>
      {detail ? (
        <p className="mb-0 mt-1.5 text-[10px] leading-4 text-[var(--nna-text-secondary)]">
          {detail}
        </p>
      ) : null}
      {trend ? (
        <p className="mb-0 mt-1.5 text-[10px] font-semibold text-emerald-600">{trend}</p>
      ) : null}
    </Card>
  );
}
