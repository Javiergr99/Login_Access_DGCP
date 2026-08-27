import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/shared/lib/cn";

type ReadOnlyDataCardProps = {
  title: string;
  icon: LucideIcon;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ReadOnlyDataCard({
  title,
  icon: Icon,
  description,
  children,
  className,
}: ReadOnlyDataCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <header className="flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3.5 sm:px-5">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
          <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-bold-token text-[var(--color-text-primary)]">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs leading-5 text-[var(--color-text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>
      </header>
      {children}
    </Card>
  );
}
