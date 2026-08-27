import { cn } from "@/shared/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-subtle)]",
        className,
      )}
    />
  );
}
