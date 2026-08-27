import "./shared/navigation/scroll-reset";
import { StrictMode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { Toaster } from "sonner";

import { queryClient } from "@/app/providers/query-client";
import { router } from "@/app/router/router";
import { SessionSecurityProvider } from "@/features/auth/components/session-security-provider";
import "@/app/styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento raíz de la aplicación.");
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipPrimitive.Provider delayDuration={250}>
        <SessionSecurityProvider>
          <RouterProvider router={router} />
        </SessionSecurityProvider>
        <Toaster position="top-right" richColors closeButton offset={76} />
      </TooltipPrimitive.Provider>
    </QueryClientProvider>
  </StrictMode>,
);
