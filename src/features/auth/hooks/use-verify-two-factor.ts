import { authService } from "@/features/auth/api/auth.service";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { completeAuthentication } from "@/features/auth/services/complete-authentication";
import { useAsyncCommand } from "@/shared/hooks/use-async-command";

type VerifyTwoFactorInput = Parameters<typeof authService.verifyTwoFactor>[0];

export function useVerifyTwoFactor() {
  return useAsyncCommand(async (input: VerifyTwoFactorInput) => {
    const rememberSession = useAuthStore.getState().pendingAuthentication?.rememberSession ?? false;

    const tokens = await authService.verifyTwoFactor(input, rememberSession);

    return completeAuthentication(tokens, rememberSession);
  });
}
