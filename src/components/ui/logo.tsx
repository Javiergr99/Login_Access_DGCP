import { Activity } from "lucide-react";
import { Link } from "react-router";

export function Logo({ to = "/login" }: { to?: string }) {
  return (
    <Link
      to={to}
      className="focus-ring flex items-center gap-3 rounded-[var(--radius-sm)]"
      aria-label="Mesa de Ayuda 2.0"
    >
      <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-[var(--shadow-xs)]">
        <Activity className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <strong className="block text-base text-[var(--color-text-primary)]">Mesa de Ayuda</strong>
        <span className="block text-[11px] font-bold-token text-[var(--color-primary)]">v2.0</span>
      </span>
    </Link>
  );
}
