import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type ReadOnlyDataItemProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export function ReadOnlyDataItem({ label, value, className }: ReadOnlyDataItemProps) {
  return (
    <div className={cn("min-w-0 px-4 py-3.5 sm:px-5", className)}>
      <dt className="text-[10px] font-semibold-token uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="mt-1.5 break-words text-[13px] font-semibold-token leading-5 text-[var(--color-text-primary)] sm:text-sm">
        {value}
      </dd>
    </div>
  );
}
