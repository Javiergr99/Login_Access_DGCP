import type { TokenResponse } from "@/features/auth/api/auth.contracts";
import { authService } from "@/features/auth/api/auth.service";
import { authTokenStorage } from "@/features/auth/services/token-storage";

export async function completeAuthentication(tokens: TokenResponse, rememberSession: boolean) {
  authTokenStorage.save(tokens, rememberSession);

  try {
    return await authService.getCurrentUser();
  } catch (error) {
    authTokenStorage.clear();
    throw error;
  }
}
