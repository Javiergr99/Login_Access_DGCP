import { authService } from "@/features/auth/api/auth.service";
import type { LoginRequest } from "@/features/auth/api/auth.contracts";
import { useAsyncCommand } from "@/shared/hooks/use-async-command";

export function useLogin() {
  return useAsyncCommand((input: LoginRequest) => authService.login(input));
}
