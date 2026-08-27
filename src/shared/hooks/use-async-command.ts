import { useCallback, useRef, useState } from "react";

export type AsyncCommandStatus = "idle" | "pending" | "success" | "error";

type AsyncCommandState<TData, TVariables, TError> = {
  status: AsyncCommandStatus;
  data: TData | undefined;
  error: TError | null;
  variables: TVariables | undefined;
};

function createIdleState<TData, TVariables, TError>(): AsyncCommandState<
  TData,
  TVariables,
  TError
> {
  return {
    status: "idle",
    data: undefined,
    error: null,
    variables: undefined,
  };
}

/**
 * Ejecuta comandos HTTP transitorios que no representan una entidad
 * cacheada por TanStack Query.
 *
 * Conserva una interfaz equivalente a la parte de useMutation que utiliza
 * este portal: mutate/mutateAsync, estado, data, error y reset.
 */
export function useAsyncCommand<TData, TVariables, TError = Error>(
  command: (variables: TVariables) => Promise<TData>,
) {
  const [state, setState] = useState<AsyncCommandState<TData, TVariables, TError>>(() =>
    createIdleState<TData, TVariables, TError>(),
  );

  const executionIdRef = useRef(0);

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      const executionId = executionIdRef.current + 1;
      executionIdRef.current = executionId;

      setState({
        status: "pending",
        data: undefined,
        error: null,
        variables,
      });

      try {
        const data = await command(variables);

        if (executionIdRef.current === executionId) {
          setState({
            status: "success",
            data,
            error: null,
            variables,
          });
        }

        return data;
      } catch (error) {
        if (executionIdRef.current === executionId) {
          setState({
            status: "error",
            data: undefined,
            error: error as TError,
            variables,
          });
        }

        throw error;
      }
    },
    [command],
  );

  const mutate = useCallback(
    (variables: TVariables) => {
      void mutateAsync(variables).catch(() => undefined);
    },
    [mutateAsync],
  );

  const reset = useCallback(() => {
    executionIdRef.current += 1;
    setState(createIdleState<TData, TVariables, TError>());
  }, []);

  return {
    ...state,
    isIdle: state.status === "idle",
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    mutate,
    mutateAsync,
    reset,
  };
}
