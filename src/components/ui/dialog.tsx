import type { ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/shared/lib/cn";

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
  bodyClassName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <LazyMotion features={domAnimation}>
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open ? (
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Overlay asChild forceMount>
                <m.div
                  className="fixed inset-0 z-[var(--z-modal)] bg-[var(--overlay-modal)] backdrop-blur-[1px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content asChild forceMount>
                <m.div
                  className={cn(
                    "fixed left-1/2 top-1/2 z-[var(--z-modal)] flex max-h-[calc(100dvh-2rem)]",
                    "w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden",
                    "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]",
                    "shadow-[var(--shadow-modal)] outline-none",
                    className,
                  )}
                  initial={{ opacity: 0, scale: 0.985, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.99, y: 4 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] px-5 py-4 sm:px-6 sm:py-5">
                    <div className="min-w-0">
                      <DialogPrimitive.Title className="text-lg font-bold-token text-[var(--color-text-primary)]">
                        {title}
                      </DialogPrimitive.Title>
                      {description ? (
                        <DialogPrimitive.Description className="mt-1 text-sm leading-5 text-[var(--color-text-secondary)]">
                          {description}
                        </DialogPrimitive.Description>
                      ) : null}
                    </div>
                    <DialogPrimitive.Close
                      className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
                      aria-label="Cerrar"
                    >
                      <X className="h-4.5 w-4.5" />
                    </DialogPrimitive.Close>
                  </div>
                  {children ? (
                    <div
                      className={cn(
                        "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5",
                        bodyClassName,
                      )}
                    >
                      {children}
                    </div>
                  ) : null}
                  {footer ? (
                    <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-5 py-3.5 sm:px-6 sm:py-4">
                      {footer}
                    </div>
                  ) : null}
                </m.div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          ) : null}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </LazyMotion>
  );
}
