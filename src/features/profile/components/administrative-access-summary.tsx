import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";

import { ReadOnlyDataCard } from "@/features/profile/components/read-only-data-card";

export function AdministrativeAccessSummary({
  role,
  permissions,
}: {
  role: string;
  permissions: string[];
}) {
  return (
    <ReadOnlyDataCard
      title="Acceso administrativo"
      description="Funciones de administración habilitadas para esta cuenta."
      icon={KeyRound}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/80 px-3.5 py-3 text-violet-900">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-600 text-white shadow-sm">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold-token text-violet-700">{role}</p>
            <p className="mt-0.5 text-xs leading-5 text-violet-700/80">
              {role === "SUPER_ADMIN"
                ? "Acceso global a la administración de sistemas, usuarios, grupos, módulos y acciones."
                : "Acceso administrativo dentro del alcance autorizado por el backend."}
            </p>
          </div>
        </div>

        <ul className="auth-profile-permission-grid mt-4 grid overflow-hidden rounded-xl border border-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
          {permissions.map((permission) => (
            <li
              key={permission}
              className="auth-profile-permission-item flex min-w-0 items-center gap-2.5 px-3.5 py-3 text-xs font-semibold-token text-[var(--color-text-primary)]"
            >
              <CheckCircle2
                className="h-4 w-4 shrink-0 text-[var(--color-primary)]"
                strokeWidth={2.1}
                aria-hidden="true"
              />
              <span className="leading-5">{permission}</span>
            </li>
          ))}
        </ul>
      </div>
    </ReadOnlyDataCard>
  );
}
