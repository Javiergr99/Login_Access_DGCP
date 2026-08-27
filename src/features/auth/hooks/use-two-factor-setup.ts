import { useQuery } from "@tanstack/react-query";

import { authKeys } from "@/features/auth/api/auth.keys";
import { authService } from "@/features/auth/api/auth.service";

export function useTwoFactorSetup(tempToken: string | null) {
  return useQuery({
    queryKey: authKeys.twoFactorSetup(tempToken ?? "missing"),
    queryFn: () => authService.setupTwoFactor({ temp_token: tempToken ?? "" }),
    enabled: Boolean(tempToken),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
