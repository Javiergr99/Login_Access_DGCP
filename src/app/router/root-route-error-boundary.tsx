import { isRouteErrorResponse, useRouteError } from "react-router";

function getErrorStatus(error: unknown): string | null {
  if (!isRouteErrorResponse(error)) {
    return null;
  }

  return String(error.status);
}

function getDevelopmentDetail(error: unknown): string | null {
  if (!import.meta.env.DEV) {
    return null;
  }

  if (isRouteErrorResponse(error)) {
    return error.statusText || (typeof error.data === "string" ? error.data : null);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return null;
}

export function RootRouteErrorBoundary() {
  const error = useRouteError();
  const status = getErrorStatus(error);
  const developmentDetail = getDevelopmentDetail(error);

  return (
    <main className="grid min-h-dvh place-items-center bg-[var(--color-background)] px-5 py-10 text-[var(--color-text-primary)]">
      <section
        className="w-full max-w-xl rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8"
        aria-labelledby="route-error-title"
      >
        <p className="text-xs font-semibold-token uppercase tracking-[0.12em] text-[var(--color-primary)]">
          {status ? `Error ${status}` : "Error de aplicación"}
        </p>

        <h1 id="route-error-title" className="mt-2 text-2xl font-bold-token">
          No fue posible mostrar esta pantalla
        </h1>

        <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
          Ocurrió un problema inesperado al cargar esta sección. Puede volver al inicio de sesión o
          intentar cargar la página nuevamente.
        </p>

        {developmentDetail ? (
          <pre className="mt-4 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-md)] bg-[var(--color-surface-subtle)] p-3 text-xs text-[var(--color-text-secondary)]">
            {developmentDetail}
          </pre>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/login"
            className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-4 text-sm font-semibold-token text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            Volver al inicio
          </a>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="focus-ring inline-flex min-h-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-semibold-token text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-subtle)]"
          >
            Intentar nuevamente
          </button>
        </div>
      </section>
    </main>
  );
}
