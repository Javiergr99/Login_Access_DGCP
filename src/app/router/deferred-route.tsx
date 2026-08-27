import { Suspense, type ReactNode } from "react";

function RouteChunkFallback() {
  return (
    <div
      className="grid min-h-screen place-items-center bg-[var(--color-page-background)] px-6"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <span
          className="mx-auto block h-7 w-7 animate-spin rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-primary)]"
          aria-hidden="true"
        />
        <p className="mt-3 text-sm font-medium-token text-[var(--color-text-secondary)]">
          Cargando pantalla…
        </p>
      </div>
    </div>
  );
}

export function DeferredRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteChunkFallback />}>{children}</Suspense>;
}
