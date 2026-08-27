import type { AppAction } from "@/features/auth/api/auth.contracts";

const actionLabels: Partial<Record<AppAction, string>> = {
  VER_DASHBOARD: "Consultar dashboard",
  VER_BITACORA: "Consultar bitácora",
  CREAR_BITACORA: "Registrar atenciones",
  ACTUALIZAR_BITACORA: "Actualizar registros",
  ELIMINAR_BITACORA: "Eliminar registros",
  SUBIR_ARCHIVO_BITACORA: "Adjuntar archivos",
  SUPER_ADMIN: "Administración total",
  ADMINISTRAR_USUARIOS: "Administrar usuarios",
  VER_USUARIOS: "Consultar usuarios",
  VER_USUARIO_DETALLE: "Consultar detalle",
  ACTUALIZAR_USUARIO: "Actualizar información",
  VER_CATALOGO_PERMISOS: "Consultar permisos",
  ASIGNAR_GRUPOS_USUARIO: "Asignar grupos",
  ASIGNAR_MODULOS_USUARIO: "Asignar módulos",
  ASIGNAR_ACCIONES_USUARIO: "Asignar acciones",
  CAPTURAR_FORMATO_ATENCIONES: "Capturar formatos",
  VER_MIS_FORMATOS_ATENCIONES: "Consultar mis formatos",
  VER_FORMATO_PROPIO: "Consultar formato propio",
  DESCARGAR_COMPROBANTE_FORMATO: "Descargar comprobante",
  GENERAR_EXCEL_FORMATO_INDIVIDUAL: "Exportar formato individual",
  GENERAR_REPORTE_EXCEL: "Generar reporte Excel",
  GENERAR_REPORTE_PDF: "Generar reporte PDF",
};

function sentenceCase(value: string) {
  const normalized = value.toLocaleLowerCase("es-MX").replaceAll("_", " ");
  return normalized.charAt(0).toLocaleUpperCase("es-MX") + normalized.slice(1);
}

export function formatPermissionLabel(action: AppAction) {
  return actionLabels[action] ?? sentenceCase(action);
}
