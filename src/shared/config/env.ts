const readBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
};

export const env = {
  apiUrl: import.meta.env.VITE_API_URL || "http://127.0.0.1:8001",
  enableMocks: readBoolean(import.meta.env.VITE_ENABLE_MOCKS, true),
  publicSites: {
    porTusDerechos: import.meta.env.VITE_POR_TUS_DERECHOS_URL || "/login",
    gobMxSearch: import.meta.env.VITE_GOBMX_SEARCH_URL || "https://www.gob.mx/busqueda",
  },
  destinations: {
    mesaAyuda: import.meta.env.VITE_MESA_AYUDA_URL || "http://127.0.0.1:5173/app/dashboard",
    formatoNna: import.meta.env.VITE_FORMATO_NNA_URL || "http://127.0.0.1:5175/app/dashboard",
    directorioProcuradores:
      import.meta.env.VITE_DIRECTORIO_PROCURADORES_URL || "http://127.0.0.1:5177/procuradores",
    controlAgendaNacional:
      import.meta.env.VITE_CONTROL_AGENDA_URL || "http://127.0.0.1:5179/app/dashboard",
    administracion: import.meta.env.VITE_ADMIN_URL || "http://127.0.0.1:5180/app/dashboard",
  },
} as const;
