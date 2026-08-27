import { authService } from "@/features/auth/api/auth.service";
import type { ResetPasswordRequest } from "@/features/auth/api/auth.contracts";
import { useAsyncCommand } from "@/shared/hooks/use-async-command";

export function useResetPassword() {
  return useAsyncCommand((input: ResetPasswordRequest) => authService.resetPassword(input));
}
