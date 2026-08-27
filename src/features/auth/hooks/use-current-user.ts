import { useQuery } from "@tanstack/react-query";

import { authKeys } from "@/features/auth/api/auth.keys";
import { authService } from "@/features/auth/api/auth.service";

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1_000,
  });
}
