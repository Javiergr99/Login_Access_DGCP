/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ENABLE_MOCKS?: string;
  readonly VITE_MESA_AYUDA_URL?: string;
  readonly VITE_FORMATO_NNA_URL?: string;
  readonly VITE_DIRECTORIO_PROCURADORES_URL?: string;
  readonly VITE_CONTROL_AGENDA_URL?: string;
  readonly VITE_ADMIN_URL?: string;
  readonly VITE_POR_TUS_DERECHOS_URL?: string;
  readonly VITE_GOBMX_SEARCH_URL?: string;
  readonly VITE_FORMATO_NNA_PUBLIC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
