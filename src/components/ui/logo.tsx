import { Activity } from "lucide-react";
import { Link } from "react-router";

type LogoProps = {
  to?: string;
  compactOnMobile?: boolean;
};

export function Logo({ to = "/login", compactOnMobile = false }: LogoProps) {
  return (
    <Link
      to={to}
      className="focus-ring flex min-w-0 items-center gap-2.5 rounded-[var(--radius-sm)] sm:gap-3"
      aria-label="Ecosistema Integral DGCP"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-[var(--shadow-xs)]">
        <Activity className="h-5 w-5" />
      </span>

      <span className="min-w-0 leading-tight">
        {compactOnMobile ? (
          <>
            <strong className="block text-[12px] leading-4 text-[var(--color-text-primary)] sm:hidden">
              Ecosistema DGCP
            </strong>
            <strong className="hidden text-base text-[var(--color-text-primary)] sm:block">
              Ecosistema Integral DGCP
            </strong>
          </>
        ) : (
          <strong className="block text-base text-[var(--color-text-primary)]">
            Ecosistema Integral DGCP
          </strong>
        )}

        <span
          className={
            compactOnMobile
              ? "hidden text-[11px] font-bold-token text-[var(--color-primary)] sm:block"
              : "block text-[11px] font-bold-token text-[var(--color-primary)]"
          }
        >
          v2.0
        </span>
      </span>
    </Link>
  );
}
