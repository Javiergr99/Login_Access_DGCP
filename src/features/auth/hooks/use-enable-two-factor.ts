import { authService } from "@/features/auth/api/auth.service";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { completeAuthentication } from "@/features/auth/services/complete-authentication";
import { useAsyncCommand } from "@/shared/hooks/use-async-command";

type EnableTwoFactorInput = Parameters<typeof authService.enableTwoFactor>[0];

export function useEnableTwoFactor() {
  return useAsyncCommand(async (input: EnableTwoFactorInput) => {
    const rememberSession = useAuthStore.getState().pendingAuthentication?.rememberSession ?? false;

    const tokens = await authService.enableTwoFactor(input, rememberSession);

    return completeAuthentication(tokens, rememberSession);
  });
}
