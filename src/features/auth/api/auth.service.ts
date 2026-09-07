import { httpClient, refreshSessionWithCookie } from "@/api/http-client";
import type {
  CreatePasswordRequest,
  CreatePasswordResponse,
  EnableTwoFactorRequest,
  EnableTwoFactorResponse,
  GetCurrentUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RecoverPasswordRequest,
  RecoverPasswordResponse,
  RefreshSessionResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  TempTokenRequest,
  TwoFactorSetupResponse,
  VerifyTwoFactorRequest,
  VerifyTwoFactorResponse,
} from "@/features/auth/api/auth.contracts";
import { mockAuthService } from "@/features/auth/api/mock-auth.service";
import { env } from "@/shared/config/env";

export type AuthService = {
  login(input: LoginRequest): Promise<LoginResponse>;
  setupTwoFactor(input: TempTokenRequest): Promise<TwoFactorSetupResponse>;
  verifyTwoFactor(
    input: VerifyTwoFactorRequest,
    rememberSession?: boolean,
  ): Promise<VerifyTwoFactorResponse>;
  enableTwoFactor(
    input: EnableTwoFactorRequest,
    rememberSession?: boolean,
  ): Promise<EnableTwoFactorResponse>;
  getCurrentUser(): Promise<GetCurrentUserResponse>;
  refreshSession(): Promise<RefreshSessionResponse>;
  logout(): Promise<LogoutResponse>;
  recoverPassword(input: RecoverPasswordRequest): Promise<RecoverPasswordResponse>;
  resetPassword(input: ResetPasswordRequest): Promise<ResetPasswordResponse>;
  createPassword(input: CreatePasswordRequest): Promise<CreatePasswordResponse>;
};

function rememberSessionHeaders(rememberSession = false) {
  return {
    "X-Remember-Session": rememberSession ? "true" : "false",
  };
}

export const httpAuthService: AuthService = {
  async login(input) {
    const formData = new URLSearchParams({
      username: input.curp.trim().toUpperCase(),
      password: input.password,
    });

    const response = await httpClient.post<LoginResponse>("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  },

  async setupTwoFactor(input) {
    const response = await httpClient.post<TwoFactorSetupResponse>("/auth/setup", input);
    return response.data;
  },

  async verifyTwoFactor(input, rememberSession) {
    const response = await httpClient.post<VerifyTwoFactorResponse>("/auth/login/2fa", input, {
      headers: rememberSessionHeaders(rememberSession),
    });
    return response.data;
  },

  async enableTwoFactor(input, rememberSession) {
    const response = await httpClient.post<EnableTwoFactorResponse>("/auth/enable", input, {
      headers: rememberSessionHeaders(rememberSession),
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await httpClient.get<GetCurrentUserResponse>("/users/me");
    return response.data;
  },

  async refreshSession() {
    return refreshSessionWithCookie();
  },

  async logout() {
    const response = await httpClient.post<LogoutResponse>("/auth/logout");
    return response.data;
  },

  async recoverPassword(input) {
    const response = await httpClient.post<RecoverPasswordResponse>(
      "/auth/recover-password",
      input,
    );
    return response.data;
  },

  async resetPassword(input) {
    const response = await httpClient.post<ResetPasswordResponse>("/auth/reset-password", input);
    return response.data;
  },

  async createPassword(input) {
    const response = await httpClient.post<CreatePasswordResponse>("/auth/create-password", input);
    return response.data;
  },
};

export const authService: AuthService = env.enableMocks ? mockAuthService : httpAuthService;
