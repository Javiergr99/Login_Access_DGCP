import { Skeleton } from "@/components/ui/skeleton";

export function AccessCardSkeleton() {
  return (
    <div className="min-h-[286px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[18px] shadow-[var(--shadow-access-card)]">
      <div className="flex items-start justify-between">
        <Skeleton className="h-8 w-8 rounded-[9px]" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-5 w-1/2" />
      <Skeleton className="mt-2 h-3.5 w-full" />
      <Skeleton className="mt-2 h-3.5 w-3/4" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3.5 w-20" />
      </div>
      <div className="mt-6 flex items-end justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24 rounded-[var(--radius-sm)]" />
      </div>
    </div>
  );
}
