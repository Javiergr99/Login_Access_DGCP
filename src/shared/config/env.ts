const readBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

function requiredRuntimeValue(value: string | undefined, variableName: string): string {
  const configured = value?.trim();

  if (configured) return configured;

  throw new Error(
    `Falta la variable de entorno ${variableName}. Login Access no puede iniciar sin esta configuración.`,
  );
}

function optionalRuntimeValue(value: string | undefined): string {
  return value?.trim() || "";
}

export const env = {
  apiUrl: requiredRuntimeValue(import.meta.env.VITE_API_URL, "VITE_API_URL"),
  enableMocks: readBoolean(import.meta.env.VITE_ENABLE_MOCKS, true),
  publicSites: {
    porTusDerechos: import.meta.env.VITE_POR_TUS_DERECHOS_URL?.trim() || "/login",
    gobMxSearch: import.meta.env.VITE_GOBMX_SEARCH_URL?.trim() || "https://www.gob.mx/busqueda",
  },
  destinations: {
    mesaAyuda: requiredRuntimeValue(import.meta.env.VITE_MESA_AYUDA_URL, "VITE_MESA_AYUDA_URL"),
    formatoNna: optionalRuntimeValue(import.meta.env.VITE_FORMATO_NNA_URL),
    directorioProcuradores: optionalRuntimeValue(import.meta.env.VITE_DIRECTORIO_PROCURADORES_URL),
    controlAgendaNacional: optionalRuntimeValue(import.meta.env.VITE_CONTROL_AGENDA_URL),
    administracion: optionalRuntimeValue(import.meta.env.VITE_ADMIN_URL),
  },
} as const;
