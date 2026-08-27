import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type SecurityStatusItemProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function SecurityStatusItem({ label, children, className }: SecurityStatusItemProps) {
  return (
    <div className={cn("min-w-0 px-4 py-3.5 sm:px-5", className)}>
      <p className="text-[10px] font-semibold-token uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
