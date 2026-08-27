import { Check, Circle } from "lucide-react";

import {
  PASSWORD_REQUIREMENTS,
  PASSWORD_SPECIAL_CHARACTERS,
  evaluatePasswordRequirements,
} from "../model/password-policy";

type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = evaluatePasswordRequirements(password);

  return (
    <div
      className="rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3.5 sm:px-4"
      aria-label="Requisitos de contraseña"
    >
      <p className="text-[12px] font-semibold text-slate-800 sm:text-[13px]">
        Tu contraseña debe incluir:
      </p>

      <ul className="mt-2.5 grid grid-cols-1 gap-x-4 gap-y-2 text-[12px] sm:grid-cols-2">
        {PASSWORD_REQUIREMENTS.map((requirement) => {
          const completed = requirements[requirement.key];
          const Icon = completed ? Check : Circle;

          return (
            <li key={requirement.key} className="flex items-start gap-2 text-slate-600">
              <span
                className={[
                  "mt-[1px] grid h-4 w-4 shrink-0 place-items-center rounded-full transition-colors",
                  completed ? "bg-emerald-50 text-emerald-700" : "text-slate-400",
                ].join(" ")}
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              </span>

              <span
                className={["leading-[18px]", completed ? "font-medium text-slate-800" : ""].join(
                  " ",
                )}
              >
                {requirement.label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 border-t border-slate-200/80 pt-2.5">
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] leading-5 text-slate-500">
          <span>Caracteres especiales permitidos:</span>
          <code className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-slate-700 ring-1 ring-slate-200">
            {PASSWORD_SPECIAL_CHARACTERS}
          </code>
        </p>
      </div>
    </div>
  );
}
