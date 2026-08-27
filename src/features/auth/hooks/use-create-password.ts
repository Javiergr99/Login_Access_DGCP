import {
  createPasswordRequest,
  type CreatePasswordPayload,
  type CreatePasswordRequestError,
  type CreatePasswordResponse,
} from "../api/create-password.api";
import { useAsyncCommand } from "@/shared/hooks/use-async-command";

export function useCreatePassword() {
  return useAsyncCommand<CreatePasswordResponse, CreatePasswordPayload, CreatePasswordRequestError>(
    createPasswordRequest,
  );
}
