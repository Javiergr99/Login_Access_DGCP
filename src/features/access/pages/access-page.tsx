import { useEffect, useMemo, useRef, useState } from "react";
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { normalizeApiError } from "@/api/api-error";
import { AccessLayout } from "@/components/layout/access-layout";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { AccessCard } from "@/features/access/components/access-card";
import { AccessCardSkeleton } from "@/features/access/components/access-card-skeleton";
import { PermissionDialog } from "@/features/access/components/permission-dialog";
import { UserPermissionSummary } from "@/features/access/components/user-permission-summary";
import { useAvailableAccesses } from "@/features/access/hooks/use-available-accesses";
import { useRedirectCode } from "@/features/access/hooks/use-redirect-code";
import {
  mapAccessEntryError,
  type AccessEntryError,
} from "@/features/access/model/access-entry-error";
import { buildEcosystemAccessCatalog } from "@/features/access/model/ecosystem-access-catalog";
import type { AccessItem } from "@/features/access/model/access.types";
import { authTokenStorage } from "@/features/auth/services/token-storage";
import { env } from "@/shared/config/env";
import { appendRedirectExchangeParams, normalizeRedirectUrl } from "@/shared/lib/redirect-url";

const ACCESS_SKELETON_IDS = [
  "access-skeleton-1",
  "access-skeleton-2",
  "access-skeleton-3",
  "access-skeleton-4",
  "access-skeleton-5",
] as const;

function useAccessNavigation() {
  const [selectedAccess, setSelectedAccess] = useState<AccessItem | null>(null);
  const [enteringAccessId, setEnteringAccessId] = useState<string | null>(null);
  const [enterError, setEnterError] = useState<AccessEntryError | null>(null);
  const navigationLockRef = useRef(false);
  const redirectMutation = useRedirectCode();

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      navigationLockRef.current = false;
      setEnteringAccessId(null);
      setEnterError(null);
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const enterAccess = async (access: AccessItem) => {
    if (access.access_level === "restricted" || navigationLockRef.current) return;

    navigationLockRef.current = true;
    setEnterError(null);
    setEnteringAccessId(access.id);
    let normalizedDestination: string | undefined;

    try {
      if (!access.target_url) {
        throw new Error("El acceso no tiene una dirección de destino configurada.");
      }

      normalizedDestination = normalizeRedirectUrl(access.target_url);
      if (env.enableMocks) {
        window.location.assign(normalizedDestination);
        return;
      }

      const response = await redirectMutation.mutateAsync(access);
      window.location.assign(
        appendRedirectExchangeParams({
          redirectUrl: normalizedDestination,
          code: response.code,
          persistence: authTokenStorage.getPersistence(),
        }),
      );
    } catch (error) {
      setEnterError(mapAccessEntryError(error, normalizedDestination));
      setEnteringAccessId(null);
      navigationLockRef.current = false;
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setSelectedAccess(null);
  };

  return {
    selectedAccess,
    setSelectedAccess,
    enteringAccessId,
    enterError,
    enterAccess,
    handleDialogOpenChange,
  };
}

function AccessEntryAlert({ error }: { error: AccessEntryError | null }) {
  if (!error) return null;

  return (
    <Alert tone="error" title={error.title} className="mt-3">
      <p>{error.message}</p>
      <DevelopmentDestination destination={error.destination} />
    </Alert>
  );
}

function DevelopmentDestination({ destination }: { destination?: string }) {
  if (!destination || !import.meta.env.DEV) return null;

  return <p className="mt-2 break-all font-mono text-[11px]">Destino solicitado: {destination}</p>;
}

function AccessLoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {ACCESS_SKELETON_IDS.map((skeletonId) => (
        <AccessCardSkeleton key={skeletonId} />
      ))}
    </div>
  );
}

function AccessErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--palette-red-200)] bg-[var(--color-surface)] p-10 text-center">
      <Typography as="h3" variant="cardTitle">
        No fue posible construir sus accesos
      </Typography>
      <Typography variant="bodyMuted" className="mt-2">
        {normalizeApiError(error).message ||
          "Ocurrió un problema al interpretar los permisos de su cuenta."}
      </Typography>
      <Button onClick={onRetry} className="mt-5">
        Intentar nuevamente
      </Button>
    </div>
  );
}

function AccessEmptyState() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
      <Typography as="h3" variant="cardTitle">
        Sin áreas asignadas
      </Typography>
      <Typography variant="bodyMuted" className="mt-2">
        Tu cuenta está activa, pero el backend no reportó grupos o acciones que habiliten una
        aplicación.
      </Typography>
    </div>
  );
}

function AccessGrid({
  accesses,
  enteringAccessId,
  onEnter,
  onViewPermissions,
}: {
  accesses: AccessItem[];
  enteringAccessId: string | null;
  onEnter: (access: AccessItem) => Promise<void>;
  onViewPermissions: (access: AccessItem) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {accesses.map((access, index) => (
        <AccessCard
          key={access.id}
          access={access}
          animationIndex={index}
          isEntering={enteringAccessId === access.id}
          isNavigationLocked={enteringAccessId !== null}
          onEnter={() => void onEnter(access)}
          onViewPermissions={() => onViewPermissions(access)}
        />
      ))}
    </div>
  );
}

function AccessResults({
  isError,
  error,
  isLoading,
  accesses,
  enteringAccessId,
  onRetry,
  onEnter,
  onViewPermissions,
}: {
  isError: boolean;
  error: unknown;
  isLoading: boolean;
  accesses: AccessItem[];
  enteringAccessId: string | null;
  onRetry: () => void;
  onEnter: (access: AccessItem) => Promise<void>;
  onViewPermissions: (access: AccessItem) => void;
}) {
  if (isError) return <AccessErrorState error={error} onRetry={onRetry} />;
  if (isLoading) return <AccessLoadingGrid />;
  if (accesses.length === 0) return <AccessEmptyState />;

  return (
    <AccessGrid
      accesses={accesses}
      enteringAccessId={enteringAccessId}
      onEnter={onEnter}
      onViewPermissions={onViewPermissions}
    />
  );
}

function enabledAccessCount(accesses: AccessItem[]) {
  return accesses.filter((access) => access.access_level !== "restricted").length;
}

function AccessSection({
  accesses,
  isError,
  error,
  isLoading,
  enteringAccessId,
  onRetry,
  onEnter,
  onViewPermissions,
}: {
  accesses: AccessItem[];
  isError: boolean;
  error: unknown;
  isLoading: boolean;
  enteringAccessId: string | null;
  onRetry: () => void;
  onEnter: (access: AccessItem) => Promise<void>;
  onViewPermissions: (access: AccessItem) => void;
}) {
  return (
    <section className="mt-5" aria-labelledby="access-title">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <Typography as="h2" id="access-title" variant="sectionTitle">
            Áreas autorizadas
          </Typography>
          <Typography variant="bodyMuted" className="mt-0.5 text-[12px]">
            Seleccione un sistema. La habilitación de cada acceso depende de los permisos asignados
            a su cuenta.
          </Typography>
        </div>
        <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1.5 text-[11px] font-semibold-token text-[var(--color-primary)]">
          {enabledAccessCount(accesses)} de {accesses.length} habilitados
        </span>
      </div>

      <AccessResults
        isError={isError}
        error={error}
        isLoading={isLoading}
        accesses={accesses}
        enteringAccessId={enteringAccessId}
        onRetry={onRetry}
        onEnter={onEnter}
        onViewPermissions={onViewPermissions}
      />
    </section>
  );
}

function AccessPageHeader() {
  return (
    <header>
      <p className="text-[11px] font-medium-token text-[var(--color-text-secondary)]">
        Inicio <span className="px-1 text-[var(--color-text-muted)]">›</span>
        <span className="text-[var(--color-primary)]">Accesos disponibles</span>
      </p>
      <Typography as="h1" variant="pageTitle" className="mt-0.5">
        Accesos disponibles
      </Typography>
    </header>
  );
}

export function AccessPage() {
  const reduceMotion = useReducedMotion();
  const accessQuery = useAvailableAccesses();
  const accesses = useMemo(
    () => buildEcosystemAccessCatalog(accessQuery.data ?? []),
    [accessQuery.data],
  );
  const navigation = useAccessNavigation();

  return (
    <LazyMotion features={domAnimation}>
      <AccessLayout>
        <m.div
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
        >
          <AccessPageHeader />

          <m.div
            className="mt-3"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.24,
              delay: reduceMotion ? 0 : 0.04,
            }}
          >
            <UserPermissionSummary />
          </m.div>

          <AccessEntryAlert error={navigation.enterError} />
          <AccessSection
            accesses={accesses}
            isError={accessQuery.isError}
            error={accessQuery.error}
            isLoading={accessQuery.isLoading}
            enteringAccessId={navigation.enteringAccessId}
            onRetry={() => void accessQuery.refetch()}
            onEnter={navigation.enterAccess}
            onViewPermissions={navigation.setSelectedAccess}
          />
        </m.div>

        <PermissionDialog
          access={navigation.selectedAccess}
          open={Boolean(navigation.selectedAccess)}
          onOpenChange={navigation.handleDialogOpenChange}
        />
      </AccessLayout>
    </LazyMotion>
  );
}
