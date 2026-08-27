import { CheckCircle2, KeyRound, Link2Off, LogIn } from "lucide-react";

export type ActivationStatusVariant =
  "missing-token" | "invalid-token" | "already-configured" | "success";

type ActivationStatusCardProps = {
  variant: ActivationStatusVariant;
  message?: string;
  onGoToLogin: () => void;
};

const CONTENT: Record<
  ActivationStatusVariant,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  "missing-token": {
    eyebrow: "Activación de cuenta",
    title: "No se encontró un enlace válido",
    description: "Solicita nuevamente el correo de activación para configurar tu contraseña.",
  },
  "invalid-token": {
    eyebrow: "Enlace no disponible",
    title: "El enlace de activación ya no es válido",
    description:
      "Es posible que haya expirado, que ya haya sido utilizado o que haya sido reemplazado por un enlace más reciente.",
  },
  "already-configured": {
    eyebrow: "Cuenta configurada",
    title: "Tu cuenta ya tiene una contraseña",
    description:
      "Este flujo solo sirve para la creación inicial. Para cambiar o recuperar tu contraseña utiliza el proceso correspondiente.",
  },
  success: {
    eyebrow: "Activación completada",
    title: "Contraseña creada correctamente",
    description:
      "Tu cuenta ha sido configurada. Ya puedes iniciar sesión con la contraseña que acabas de crear.",
  },
};

export function ActivationStatusCard({ variant, message, onGoToLogin }: ActivationStatusCardProps) {
  const content = CONTENT[variant];
  const isSuccess = variant === "success";
  const Icon = isSuccess ? CheckCircle2 : Link2Off;

  return (
    <section
      aria-labelledby="activation-status-title"
      className="w-full rounded-[22px] border border-slate-200/90 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.10)] sm:p-8"
    >
      <div
        className={[
          "grid h-12 w-12 place-items-center rounded-xl",
          isSuccess
            ? "bg-emerald-50 text-emerald-700"
            : "bg-[color-mix(in_srgb,var(--color-primary)_7%,white)] text-[var(--color-primary)]",
        ].join(" ")}
      >
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-primary)]">
        {content.eyebrow}
      </p>

      <h1
        id="activation-status-title"
        className="mt-1.5 text-[24px] font-bold leading-tight tracking-[-0.02em] text-slate-950 sm:text-[26px]"
      >
        {content.title}
      </h1>

      <p className="mt-3 text-[13px] leading-6 text-slate-600 sm:text-sm">{content.description}</p>

      {message && (
        <div
          className={[
            "mt-5 rounded-xl border px-3.5 py-3 text-[12px] leading-5",
            isSuccess
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-slate-200 bg-slate-50 text-slate-700",
          ].join(" ")}
          role="status"
        >
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={onGoToLogin}
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--color-primary)] px-5 text-[13px] font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
      >
        {isSuccess ? (
          <LogIn aria-hidden="true" className="h-4 w-4" />
        ) : (
          <KeyRound aria-hidden="true" className="h-4 w-4" />
        )}
        Ir al inicio de sesión
      </button>
    </section>
  );
}
