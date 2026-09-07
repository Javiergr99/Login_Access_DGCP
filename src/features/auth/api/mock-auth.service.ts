import { ApiError } from "@/api/api-error";
import type {
  AppAction,
  CreatePasswordResponse,
  EnableTwoFactorRequest,
  EnableTwoFactorResponse,
  GetCurrentUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RecoverPasswordResponse,
  RefreshSessionResponse,
  ResetPasswordResponse,
  TempTokenRequest,
  TwoFactorSetupResponse,
  VerifyTwoFactorRequest,
  VerifyTwoFactorResponse,
} from "@/features/auth/api/auth.contracts";
import { sessionPersistence } from "@/features/auth/services/session-persistence";
import { DEMO_CREDENTIALS, DEMO_MFA_SECRET } from "@/shared/constants/demo";
import { delay } from "@/shared/lib/delay";

const MOCK_TEMP_TOKEN = "demo-temp-token";
const MOCK_ACCESS_TOKEN = "demo-access-token";

const mesaAyudaActions: AppAction[] = [
  "VER_DASHBOARD",
  "VER_BITACORA",
  "CREAR_BITACORA",
  "ACTUALIZAR_BITACORA",
  "SUBIR_ARCHIVO_BITACORA",
];

const formatosActions: AppAction[] = [
  "CAPTURAR_FORMATO_ATENCIONES",
  "VER_MIS_FORMATOS_ATENCIONES",
  "VER_FORMATO_PROPIO",
  "DESCARGAR_COMPROBANTE_FORMATO",
];

export const demoUser: GetCurrentUserResponse = {
  id: "usr-admin-001",
  nombre: "Sofía",
  primer_apellido: "Huerta",
  segundo_apellido: null,
  correo_electronico: DEMO_CREDENTIALS.identifier,
  curp: "HUSO900101MDFRRF01",
  entidad_federativa_id: 9,
  numero_telefono: null,
  is_2fa_enabled: true,
  estatus: { id: 1, nombre: "Activo" },
  instancia: {
    id: 1,
    nombre: "Mesa de Control TI",
    siglas: "MCTI",
  },
  intentos_login: 0,
  fecha_correo_verificado: "2026-08-01T12:00:00Z",
  fecha_creacion: "2026-01-15T12:00:00Z",
  fecha_actualizacion: "2026-08-01T12:00:00Z",
  permisos: {
    grupos: [
      {
        id: "group-mesa-ayuda",
        nombre: "MESA_AYUDA",
        descripcion: "Operación de Mesa de Ayuda",
        modulos: [
          {
            id: "module-bitacora",
            nombre: "BITACORA_ATENCIONES",
            descripcion: "Registro y seguimiento de atenciones",
            acciones: mesaAyudaActions.map((nombre) => ({
              id: `action-${nombre}`,
              nombre,
              descripcion: null,
            })),
          },
          {
            id: "module-admin",
            nombre: "ADMINISTRACION_USUARIOS",
            descripcion: "Administración",
            acciones: [
              {
                id: "action-super-admin",
                nombre: "SUPER_ADMIN",
                descripcion: "Control total del sistema",
              },
            ],
          },
        ],
      },
      {
        id: "group-formatos",
        nombre: "FORMATOS_ATENCIONES",
        descripcion: "Captura y consulta de formatos",
        modulos: [
          {
            id: "module-captura-formatos",
            nombre: "CAPTURA_FORMATOS",
            descripcion: "Captura de formatos",
            acciones: formatosActions.map((nombre) => ({
              id: `action-${nombre}`,
              nombre,
              descripcion: null,
            })),
          },
        ],
      },
    ],
  },
};

function tokenResponse() {
  return {
    access_token: MOCK_ACCESS_TOKEN,
    token_type: "bearer" as const,
  };
}

function assertTempToken(tempToken: string) {
  if (tempToken !== MOCK_TEMP_TOKEN) {
    throw new ApiError({
      code: "TEMP_TOKEN_EXPIRED_OR_INVALID",
      status: 401,
      message: "El token temporal expiró o no es válido.",
    });
  }
}

function assertValidOtp(input: { temp_token: string; code: string }) {
  assertTempToken(input.temp_token);

  if (input.code !== DEMO_CREDENTIALS.otp) {
    throw new ApiError({
      code: "TWO_FACTOR_CODE_INVALID",
      status: 400,
      message: "El código de autenticación es inválido.",
    });
  }
}

export const mockAuthService = {
  async login(input: LoginRequest): Promise<LoginResponse> {
    await delay(700);

    if (
      input.curp.trim().toUpperCase() !== demoUser.curp ||
      input.password !== DEMO_CREDENTIALS.password
    ) {
      throw new ApiError({
        code: "INVALID_CREDENTIALS",
        status: 401,
        message: "La CURP o la contraseña no son correctas.",
      });
    }

    return {
      status: "pending_2fa",
      temp_token: MOCK_TEMP_TOKEN,
      temp_token_expires_in: 600,
      two_factor_configured: true,
      message: "Ingresa tu código de Google Authenticator.",
    };
  },

  async setupTwoFactor(input: TempTokenRequest): Promise<TwoFactorSetupResponse> {
    await delay(450);
    assertTempToken(input.temp_token);

    return {
      status: "two_factor_setup_required",
      two_factor_configured: false,
      qr_uri: `otpauth://totp/Mesa%20de%20Ayuda:${encodeURIComponent(
        demoUser.curp,
      )}?secret=${DEMO_MFA_SECRET}&issuer=Mesa%20de%20Ayuda`,
      manual_key: DEMO_MFA_SECRET,
    };
  },

  async verifyTwoFactor(input: VerifyTwoFactorRequest): Promise<VerifyTwoFactorResponse> {
    await delay(650);
    assertValidOtp(input);
    return tokenResponse();
  },

  async enableTwoFactor(input: EnableTwoFactorRequest): Promise<EnableTwoFactorResponse> {
    await delay(650);
    assertValidOtp(input);
    return tokenResponse();
  },

  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    await delay(220);
    return demoUser;
  },

  async refreshSession(): Promise<RefreshSessionResponse> {
    await delay(180);

    if (!sessionPersistence.has()) {
      throw new ApiError({
        code: "SESSION_EXPIRED",
        status: 401,
        message: "No existe una sesión renovable.",
      });
    }

    return tokenResponse();
  },

  async logout(): Promise<LogoutResponse> {
    await delay(180);
    return { message: "Sesión cerrada correctamente." };
  },

  async recoverPassword(): Promise<RecoverPasswordResponse> {
    await delay(600);
    return {
      message: "Si el correo está registrado, recibirás instrucciones para recuperar tu acceso.",
    };
  },

  async resetPassword(): Promise<ResetPasswordResponse> {
    await delay(600);
    return { message: "Contraseña actualizada" };
  },

  async createPassword(): Promise<CreatePasswordResponse> {
    await delay(600);
    return { message: "Contraseña creada" };
  },
};
