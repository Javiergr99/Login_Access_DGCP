import { createRedirectCode } from "@/features/access/api/access.service";
import type { AccessItem } from "@/features/access/model/access.types";
import { useAsyncCommand } from "@/shared/hooks/use-async-command";

export function useRedirectCode() {
  return useAsyncCommand((access: AccessItem) => createRedirectCode(access.target_url));
}
