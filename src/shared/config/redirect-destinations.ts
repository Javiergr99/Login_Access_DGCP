import { env } from "@/shared/config/env";
import { normalizeRedirectUrl } from "@/shared/lib/redirect-url";

export const REDIRECT_DESTINATION_IDS = [
  "mesaAyuda",
  "formatoNna",
  "directorioProcuradores",
  "controlAgendaNacional",
  "administracion",
] as const;

export type RedirectDestinationId = (typeof REDIRECT_DESTINATION_IDS)[number];

const configuredDestinations: Record<RedirectDestinationId, string> = {
  mesaAyuda: env.destinations.mesaAyuda,
  formatoNna: env.destinations.formatoNna,
  directorioProcuradores: env.destinations.directorioProcuradores,
  controlAgendaNacional: env.destinations.controlAgendaNacional,
  administracion: env.destinations.administracion,
};

export function getRedirectDestination(destinationId: RedirectDestinationId): string {
  return normalizeRedirectUrl(configuredDestinations[destinationId]);
}

export function getConfiguredRedirectDestinations(): string[] {
  const destinations = REDIRECT_DESTINATION_IDS.map(getRedirectDestination);
  const uniqueDestinations = new Set(destinations);

  if (uniqueDestinations.size !== destinations.length) {
    throw new Error("Las URLs de acceso configuradas deben ser únicas para cada módulo.");
  }

  return destinations;
}

export function resolveConfiguredRedirectDestination(value: string): string {
  const normalizedDestination = normalizeRedirectUrl(value);
  const configured = new Set(getConfiguredRedirectDestinations());

  if (!configured.has(normalizedDestination)) {
    throw new Error(
      "El destino solicitado no coincide con ninguna URL configurada en el frontend.",
    );
  }

  return normalizedDestination;
}
