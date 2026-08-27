import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  leadingIcon?: ReactNode;
  trailingAction?: ReactNode;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, label, error, hint, leadingIcon, trailingAction, className, ...props },
  ref,
) {
  const fieldId = id ?? props.name;
  const descriptionId = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-label block">
        {label}
      </label>

      <div className="relative">
        {leadingIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-[var(--color-text-secondary)]">
            {leadingIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={cn(
            "focus-ring h-[var(--control-height-lg)] w-full rounded-[var(--radius-sm)] border",
            "bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-muted)]",
            "transition-colors duration-[var(--duration-normal)]",
            "hover:border-[var(--color-border-hover)]",
            "disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-disabled)]",
            leadingIcon && "pl-11",
            trailingAction && "pr-11",
            error
              ? "border-[var(--color-error)]"
              : "border-[var(--color-border)] focus:border-[var(--color-border-focus)]",
            className,
          )}
          {...props}
        />

        {trailingAction ? (
          <span className="absolute inset-y-0 right-0 grid w-11 place-items-center">
            {trailingAction}
          </span>
        ) : null}
      </div>

      {error ? (
        <p id={descriptionId} className="text-xs font-medium-token text-[var(--color-error)]">
          {error}
        </p>
      ) : null}

      {!error && hint ? (
        <p id={descriptionId} className="text-caption">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
