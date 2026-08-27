import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState, type ChangeEventHandler, type FocusEventHandler } from "react";
import { useForm } from "react-hook-form";

import {
  createPasswordSchema,
  type CreatePasswordFormValues,
} from "../schemas/create-password.schema";
import { PasswordRequirements } from "./password-requirements";
import { PasswordStrengthMeter } from "./password-strength-meter";

type CreatePasswordFormProps = {
  disabled?: boolean;
  isSubmitting: boolean;
  serverError?: string | null;
  onClearServerError?: () => void;
  onSubmit: (values: CreatePasswordFormValues) => Promise<void> | void;
};

type SecureInputProps = {
  id: string;
  label: string;
  value: string;
  name: string;
  error?: string;
  disabled?: boolean;
  visible: boolean;
  onToggleVisibility: () => void;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  inputRef: (instance: HTMLInputElement | null) => void;
};

function SecureInput({
  id,
  label,
  value,
  name,
  error,
  disabled,
  visible,
  onToggleVisibility,
  onBlur,
  onChange,
  inputRef,
}: SecureInputProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[12px] font-semibold text-slate-700 sm:text-[13px]">
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          disabled={disabled}
          autoComplete="new-password"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onBlur={onBlur}
          onChange={onChange}
          className={[
            "h-11 w-full rounded-[10px] border bg-white px-3.5 pr-11 text-[13px] text-slate-900 outline-none transition sm:text-sm",
            "placeholder:text-slate-400 focus:ring-2",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-slate-300 focus:border-[var(--color-primary)] focus:ring-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]",
            disabled ? "cursor-not-allowed opacity-60" : "",
          ].join(" ")}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={onToggleVisibility}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:pointer-events-none"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Eye aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-[11px] font-medium leading-4 text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function CreatePasswordForm({
  disabled = false,
  isSubmitting,
  serverError,
  onClearServerError,
  onSubmit,
}: CreatePasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreatePasswordFormValues>({
    resolver: zodResolver(createPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const passwordsMatch = Boolean(confirmPassword) && password === confirmPassword;

  const passwordRegistration = register("password");
  const confirmRegistration = register("confirmPassword");

  function clearServerError() {
    onClearServerError?.();
  }

  const canSubmit = isValid && !disabled && !isSubmitting;

  return (
    <form
      noValidate
      className="space-y-4.5"
      onSubmit={(event) => {
        void handleSubmit(async (values) => {
          if (values.password !== values.confirmPassword) {
            return;
          }

          await onSubmit(values);
        })(event);
      }}
    >
      <div className="space-y-4">
        <SecureInput
          id="new-password"
          label="Nueva contraseña"
          value={password}
          name={passwordRegistration.name}
          error={errors.password?.message}
          disabled={disabled || isSubmitting}
          visible={showPassword}
          onToggleVisibility={() => setShowPassword((current) => !current)}
          onBlur={(event) => {
            void passwordRegistration.onBlur(event);
          }}
          onChange={(event) => {
            void passwordRegistration.onChange(event);
            clearServerError();
          }}
          inputRef={passwordRegistration.ref}
        />

        <PasswordStrengthMeter password={password} />
        <PasswordRequirements password={password} />

        <SecureInput
          id="confirm-password"
          label="Confirmar contraseña"
          value={confirmPassword}
          name={confirmRegistration.name}
          error={errors.confirmPassword?.message}
          disabled={disabled || isSubmitting}
          visible={showConfirmPassword}
          onToggleVisibility={() => setShowConfirmPassword((current) => !current)}
          onBlur={(event) => {
            void confirmRegistration.onBlur(event);
          }}
          onChange={(event) => {
            void confirmRegistration.onChange(event);
            clearServerError();
          }}
          inputRef={confirmRegistration.ref}
        />

        {confirmPassword && !errors.confirmPassword && (
          <p
            className={[
              "text-[11px] font-medium leading-4",
              passwordsMatch ? "text-emerald-700" : "text-slate-500",
            ].join(" ")}
            aria-live="polite"
          >
            {passwordsMatch
              ? "Las contraseñas coinciden."
              : "Verifica que ambas contraseñas sean iguales."}
          </p>
        )}
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-[12px] leading-5 text-rose-800"
        >
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--color-primary)] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <KeyRound aria-hidden="true" className="h-4 w-4" />
        {isSubmitting ? "Creando contraseña..." : "Crear contraseña"}
      </button>
    </form>
  );
}
