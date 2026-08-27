import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/shared/lib/cn";

export type AuthCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Tarjeta base de autenticación reutilizada por todos los estados del flujo. */
export function AuthCard({
  eyebrow,
  title,
  description,
  icon,
  children,
  className,
}: AuthCardProps) {
  return (
    <Card
      className={cn(
        "rounded-[var(--radius-lg)] border-[var(--color-border-subtle)] p-6",
        "shadow-[var(--shadow-auth-card)] sm:p-10",
        className,
      )}
    >
      <div className="mb-7">
        {eyebrow ? (
          <p className="mb-2.5 flex items-center gap-2 text-[12px] font-bold-token uppercase tracking-[var(--letter-spacing-wide)] text-[var(--color-primary)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}

        {icon ? (
          <span className="mb-4 grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            {icon}
          </span>
        ) : null}

        <Typography as="h2" variant="authTitle">
          {title}
        </Typography>
        <Typography variant="bodyMuted" className="mt-2 leading-6">
          {description}
        </Typography>
      </div>

      {children}
    </Card>
  );
}
