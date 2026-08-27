import { useEffect, useMemo, useRef } from "react";

import { cn } from "@/shared/lib/cn";

const OTP_POSITIONS = [
  "otp-digit-1",
  "otp-digit-2",
  "otp-digit-3",
  "otp-digit-4",
  "otp-digit-5",
  "otp-digit-6",
] as const;

const OTP_LENGTH = OTP_POSITIONS.length;

export function OtpInput({
  value,
  onChange,
  disabled = false,
  error,
  autoFocus = true,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = useMemo(
    () => Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? ""),
    [value],
  );

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setDigit = (index: number, nextValue: string) => {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    onChange(nextDigits.join(""));
    if (digit && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handlePaste = (text: string) => {
    const pasted = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <div>
      <div
        className="flex justify-between gap-2 sm:gap-3"
        role="group"
        aria-label="Código de verificación de seis dígitos"
      >
        {OTP_POSITIONS.map((position, index) => (
          <input
            key={position}
            ref={(element) => {
              refs.current[index] = element;
            }}
            value={digits[index]}
            disabled={disabled}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`Dígito ${index + 1} de ${OTP_LENGTH}`}
            aria-invalid={Boolean(error)}
            onChange={(event) => setDigit(index, event.target.value)}
            onFocus={(event) => event.currentTarget.select()}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !digits[index] && index > 0)
                refs.current[index - 1]?.focus();
              if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
              if (event.key === "ArrowRight" && index < OTP_LENGTH - 1)
                refs.current[index + 1]?.focus();
            }}
            onPaste={(event) => {
              event.preventDefault();
              handlePaste(event.clipboardData.getData("text"));
            }}
            className={cn(
              "focus-ring h-12 min-w-0 flex-1 rounded-[var(--radius-sm)] border",
              "bg-[var(--color-surface)] text-center text-lg font-bold-token text-[var(--color-text-primary)]",
              "disabled:bg-[var(--color-surface-muted)]",
              error
                ? "border-[var(--color-error)]"
                : "border-[var(--color-border)] focus:border-[var(--color-border-focus)]",
            )}
          />
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-xs font-medium-token text-[var(--color-error)]">{error}</p>
      ) : null}
    </div>
  );
}
