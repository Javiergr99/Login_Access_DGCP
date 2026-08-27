import { getPasswordStrength } from "../model/password-policy";

type PasswordStrengthMeterProps = {
  password: string;
};

const LEVEL_CLASS = {
  empty: "",
  "very-weak": "bg-rose-500",
  weak: "bg-orange-500",
  medium: "bg-amber-500",
  strong: "bg-emerald-500",
  "very-strong": "bg-emerald-600",
} as const;

const LABEL_CLASS = {
  empty: "",
  "very-weak": "text-rose-700",
  weak: "text-orange-700",
  medium: "text-amber-700",
  strong: "text-emerald-700",
  "very-strong": "text-emerald-700",
} as const;

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = getPasswordStrength(password);
  const activeClass = password ? LEVEL_CLASS[strength.level] : "bg-slate-300";

  return (
    <div
      className="space-y-2"
      aria-live="polite"
      aria-label={`Seguridad de la contraseña: ${strength.label}`}
    >
      <div className="flex items-center justify-between gap-4 text-[11px] sm:text-xs">
        <span className="font-medium text-slate-600">Seguridad de la contraseña</span>
        <span
          className={[
            "font-semibold",
            password ? LABEL_CLASS[strength.level] : "text-slate-500",
          ].join(" ")}
        >
          {password ? strength.label : "Sin evaluar"}
        </span>
      </div>

      <meter
        className="sr-only"
        min={0}
        max={strength.total}
        value={password ? strength.score : 0}
        aria-label="Nivel de seguridad de la contraseña"
        aria-valuetext={password ? strength.label : "Sin evaluar"}
      />

      <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
        {Array.from({
          length: strength.total,
        }).map((_, index) => {
          const active = password && index < strength.score;

          return (
            <span
              key={`strength-segment-${index + 1}`}
              className={[
                "h-1.5 rounded-full transition-colors duration-200",
                active ? activeClass : "bg-slate-200",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}
