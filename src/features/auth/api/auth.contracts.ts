/**
 * Contrato de integración validado contra auth_service v2.0.
 *
 * Fuente funcional: contrato del 05 de agosto de 2026. Los identificadores
 * técnicos de permisos se consumen por nombre; los UUID no se usan para
 * decidir visibilidad o autorización en el frontend.
 */

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "ACCOUNT_INACTIVE"
  | "ACCOUNT_LOCKED"
  | "TEMP_TOKEN_EXPIRED_OR_INVALID"
  | "TEMP_TOKEN_INVALID_PURPOSE"
  | "TEMP_TOKEN_REVOKED"
  | "USER_INACTIVE"
  | "TWO_FACTOR_ALREADY_ENABLED"
  | "TWO_FACTOR_SETUP_REQUIRED"
  | "TWO_FACTOR_CODE_INVALID"
  | "SESSION_EXPIRED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "TOO_MANY_ATTEMPTS"
  | "INTERNAL_ERROR";

export interface ApiErrorDetail {
  code: string;
  detail: string;
}

export interface ApiErrorResponse {
  detail: ApiErrorDetail | string | unknown[];
}

export interface SuccessResponse {
  message: string;
}

export type AppGroup =
  | "MESA_AYUDA"
  | "FORMATOS_ATENCIONES"
  | "DIRECTORIO_PROCURADORES"
  | "CONTROL_AGENDA_NACIONAL"
  | "ADMINISTRACION_SISTEMA";

export type AppModule =
  | "BITACORA_ATENCIONES"
  | "ADMINISTRACION_USUARIOS"
  | "ADMINISTRACION_PERMISOS"
  | "REPORTES_INDICADORES"
  | "CAPTURA_FORMATOS"
  | "GESTION_FORMATOS"
  | "DASHBOARD_FORMATOS"
  | "REPORTES_FORMATOS";

export type AppAction =
  | "VER_BITACORA"
  | "CREAR_BITACORA"
  | "ACTUALIZAR_BITACORA"
  | "ELIMINAR_BITACORA"
  | "SUBIR_ARCHIVO_BITACORA"
  | "SUPER_ADMIN"
  | "ADMINISTRAR_USUARIOS"
  | "CREAR_USUARIO"
  | "VER_USUARIOS"
  | "VER_USUARIO_DETALLE"
  | "ACTUALIZAR_USUARIO"
  | "DESACTIVAR_USUARIO"
  | "VER_GRUPOS_USUARIO"
  | "VER_MODULOS_USUARIO"
  | "VER_ACCIONES_USUARIO"
  | "ASIGNAR_GRUPOS_USUARIO"
  | "ASIGNAR_MODULOS_USUARIO"
  | "ASIGNAR_ACCIONES_USUARIO"
  | "QUITAR_GRUPOS_USUARIO"
  | "QUITAR_MODULOS_USUARIO"
  | "QUITAR_ACCIONES_USUARIO"
  | "VER_CATALOGO_PERMISOS"
  | "CREAR_GRUPO"
  | "ACTUALIZAR_GRUPO"
  | "ELIMINAR_GRUPO"
  | "CREAR_MODULO"
  | "ACTUALIZAR_MODULO"
  | "ELIMINAR_MODULO"
  | "CREAR_ACCION"
  | "ACTUALIZAR_ACCION"
  | "ELIMINAR_ACCION"
  | "VER_DASHBOARD"
  | "GENERAR_REPORTE_EXCEL"
  | "GENERAR_REPORTE_PDF"
  | "CAPTURAR_FORMATO_ATENCIONES"
  | "VER_MIS_FORMATOS_ATENCIONES"
  | "VER_FORMATO_PROPIO"
  | "DESCARGAR_COMPROBANTE_FORMATO"
  | "ACTUALIZAR_FORMATO_DEVUELTO"
  | "VER_FORMATOS_RECIBIDOS"
  | "VER_DETALLE_FORMATO"
  | "INICIAR_REVISION_FORMATO"
  | "DEVOLVER_FORMATO_CORRECCION"
  | "VALIDAR_FORMATO_ATENCIONES"
  | "ELIMINAR_FORMATO_ATENCIONES"
  | "VER_DASHBOARD_FORMATOS"
  | "VER_ESTADISTICAS_POR_ESTADO"
  | "VER_ESTADISTICAS_POR_MUNICIPIO"
  | "VER_ESTADISTICAS_POR_INDICADOR"
  | "VER_ESTADISTICAS_POR_PERIODO"
  | "GENERAR_EXCEL_FORMATO_INDIVIDUAL"
  | "GENERAR_EXCEL_FORMATOS_CONSOLIDADO"
  | "EXPORTAR_DATOS_FORMATOS";

export interface EstatusUsuario {
  id: number;
  nombre: string;
}

export interface InstanciaUsuario {
  id: number;
  nombre: string;
  siglas: string;
}

export interface AccionUsuario {
  id: string;
  nombre: AppAction;
  descripcion: string | null;
}

export interface ModuloUsuario {
  id: string;
  nombre: string;
  descripcion: string | null;
  acciones: AccionUsuario[];
}

export interface GrupoUsuario {
  id: string;
  nombre: string;
  descripcion: string | null;
  modulos: ModuloUsuario[];
}

export interface UsuarioAutenticado {
  id: string;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  correo_electronico: string;
  curp: string;
  entidad_federativa_id: number | null;
  numero_telefono: string | null;
  is_2fa_enabled: boolean;
  estatus: EstatusUsuario | null;
  instancia: InstanciaUsuario | null;
  intentos_login: number;
  fecha_correo_verificado: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  permisos: {
    grupos: GrupoUsuario[];
  };
}

/** Alias conservado para evitar romper componentes existentes. */
export type UserWithPermissionsRead = UsuarioAutenticado;
export type GetCurrentUserResponse = UsuarioAutenticado;

export interface LoginRequest {
  curp: string;
  password: string;
  /** Decide la persistencia local de los tokens; no se envía al backend. */
  remember_session?: boolean;
}

export interface TwoFactorSetupRequiredResponse {
  status: "two_factor_setup_required";
  temp_token: string;
  temp_token_expires_in: number;
  two_factor_configured: false;
  message: string;
}

export interface TwoFactorPendingResponse {
  status: "pending_2fa";
  temp_token: string;
  temp_token_expires_in: number;
  two_factor_configured: true;
  message: string;
}

export type LoginResponse = TwoFactorSetupRequiredResponse | TwoFactorPendingResponse;

export interface TempTokenRequest {
  temp_token: string;
}

export interface TwoFactorSetupResponse {
  status: "two_factor_setup_required";
  two_factor_configured: false;
  qr_uri: string;
  manual_key: string;
}

export interface TempTokenVerifyRequest {
  temp_token: string;
  code: string;
}

export type VerifyTwoFactorRequest = TempTokenVerifyRequest;
export type EnableTwoFactorRequest = TempTokenVerifyRequest;

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
}

export type VerifyTwoFactorResponse = TokenResponse;
export type EnableTwoFactorResponse = TokenResponse;

export interface RedirectCodeRequest {
  redirect_url: string;
}

export interface RedirectCodeResponse {
  code: string;
  expires_in: number;
}

export interface ExchangeCodeRequest {
  code: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export type RefreshSessionResponse = TokenResponse;

export interface LogoutRequest {
  refresh_token: string;
}

export type LogoutResponse = SuccessResponse;

/** Flujos heredados que siguen presentes en la interfaz visual. */
export interface RecoverPasswordRequest {
  email: string;
}
export type RecoverPasswordResponse = SuccessResponse;

export interface ResetPasswordRequest {
  token: string;
  password_nueva: string;
}
export type ResetPasswordResponse = SuccessResponse;

export interface CreatePasswordRequest {
  token: string;
  password: string;
}
export type CreatePasswordResponse = SuccessResponse;
