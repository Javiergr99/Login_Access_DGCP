import { authService } from "@/features/auth/api/auth.service";
import type { RecoverPasswordRequest } from "@/features/auth/api/auth.contracts";
import { useAsyncCommand } from "@/shared/hooks/use-async-command";

export function useRecoverPassword() {
  return useAsyncCommand((input: RecoverPasswordRequest) => authService.recoverPassword(input));
}
