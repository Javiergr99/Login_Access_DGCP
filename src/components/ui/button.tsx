import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  [
    "focus-ring inline-flex items-center justify-center gap-2 border",
    "rounded-[var(--radius-sm)] px-4 text-sm",
    "font-button",
    "transition-colors duration-[var(--duration-normal)]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "border-[var(--color-primary)] bg-[var(--color-primary)]",
          "text-[var(--color-primary-foreground)] shadow-[var(--shadow-xs)]",
          "hover:border-[var(--color-primary-hover)] hover:bg-[var(--color-primary-hover)]",
          "active:border-[var(--color-primary-pressed)] active:bg-[var(--color-primary-pressed)]",
        ].join(" "),
        secondary: [
          "border-[var(--color-border)] bg-[var(--color-surface)]",
          "text-[var(--color-text-primary)] shadow-[var(--shadow-xs)]",
          "hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-muted)]",
        ].join(" "),
        ghost: [
          "border-transparent bg-transparent text-[var(--color-primary)]",
          "hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-hover)]",
        ].join(" "),
        danger: [
          "border-[var(--color-error)] bg-[var(--color-error)] text-white",
          "hover:border-[var(--color-error-hover)] hover:bg-[var(--color-error-hover)]",
        ].join(" "),
        accent: [
          "border-[var(--accent-color)] bg-[var(--accent-color)] text-white",
          "shadow-[var(--shadow-xs)]",
          "hover:border-[var(--accent-color-hover)] hover:bg-[var(--accent-color-hover)]",
        ].join(" "),
      },
      size: {
        sm: "min-h-[var(--control-height-sm)] px-3 text-xs",
        md: "min-h-[var(--control-height-md)] px-4",
        lg: "min-h-[var(--control-height-lg)] px-5 text-[15px]",
        icon: "h-[var(--control-height-md)] min-h-[var(--control-height-md)] w-[var(--control-height-md)] px-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, fullWidth, type = "button", asChild = false, ...props },
  ref,
) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
});
