import { useQuery } from "@tanstack/react-query";

import { accessKeys } from "@/features/access/api/access.keys";
import { buildAvailableAccesses } from "@/features/access/api/access.service";
import { useAuthStore } from "@/features/auth/model/auth.store";

export function useAvailableAccesses() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [...accessKeys.available(), user?.id ?? "anonymous"],
    queryFn: () => (user ? buildAvailableAccesses(user) : []),
    enabled: Boolean(user),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
