import { lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router";

import { PendingMfaRoute, ProtectedRoute, PublicOnlyRoute } from "@/app/router/route-guards";
import { DeferredRoute } from "@/app/router/deferred-route";
import { RootRouteErrorBoundary } from "@/app/router/root-route-error-boundary";

const AccessPage = lazy(() =>
  import("@/features/access/pages/access-page").then((module) => ({
    default: module.AccessPage,
  })),
);

const AuthSuccessPage = lazy(() =>
  import("@/features/auth/pages/auth-success-page").then((module) => ({
    default: module.AuthSuccessPage,
  })),
);

const CreatePasswordPage = lazy(() =>
  import("@/features/auth/pages/create-password-page").then((module) => ({
    default: module.CreatePasswordPage,
  })),
);

const LoginPage = lazy(() =>
  import("@/features/auth/pages/login-page").then((module) => ({
    default: module.LoginPage,
  })),
);

const LogoutBridgePage = lazy(() =>
  import("@/features/auth/pages/logout-bridge-page").then((module) => ({
    default: module.LogoutBridgePage,
  })),
);

const MfaSetupPage = lazy(() =>
  import("@/features/auth/pages/mfa-setup-page").then((module) => ({
    default: module.MfaSetupPage,
  })),
);

const MfaVerifyPage = lazy(() =>
  import("@/features/auth/pages/mfa-verify-page").then((module) => ({
    default: module.MfaVerifyPage,
  })),
);

const NotFoundPage = lazy(() =>
  import("@/features/auth/pages/not-found-page").then((module) => ({
    default: module.NotFoundPage,
  })),
);

const RecoverAccessPage = lazy(() =>
  import("@/features/auth/pages/recover-access-page").then((module) => ({
    default: module.RecoverAccessPage,
  })),
);

const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/reset-password-page").then((module) => ({
    default: module.ResetPasswordPage,
  })),
);

const ProfilePage = lazy(() =>
  import("@/features/profile/pages/profile-page").then((module) => ({
    default: module.ProfilePage,
  })),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <RootRouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: (
          <PublicOnlyRoute>
            <DeferredRoute>
              <LoginPage />
            </DeferredRoute>
          </PublicOnlyRoute>
        ),
      },
      {
        path: "cerrar-sesion",
        element: (
          <DeferredRoute>
            <LogoutBridgePage />
          </DeferredRoute>
        ),
      },
      {
        path: "recuperar-acceso",
        element: (
          <PublicOnlyRoute>
            <DeferredRoute>
              <RecoverAccessPage />
            </DeferredRoute>
          </PublicOnlyRoute>
        ),
      },
      {
        path: "restablecer-contrasena",
        element: (
          <PublicOnlyRoute>
            <DeferredRoute>
              <ResetPasswordPage />
            </DeferredRoute>
          </PublicOnlyRoute>
        ),
      },

      // Activación inicial de cuenta.
      // Esta ruta es pública y no debe depender de una sesión previa.
      {
        path: "crear-password",
        element: (
          <DeferredRoute>
            <CreatePasswordPage />
          </DeferredRoute>
        ),
      },

      // Alias temporal para no romper pruebas o enlaces locales anteriores.
      {
        path: "crear-contrasena",
        element: (
          <DeferredRoute>
            <CreatePasswordPage />
          </DeferredRoute>
        ),
      },
      {
        path: "mfa/verificar",
        element: (
          <PendingMfaRoute>
            <DeferredRoute>
              <MfaVerifyPage />
            </DeferredRoute>
          </PendingMfaRoute>
        ),
      },
      {
        path: "mfa/configurar",
        element: (
          <PendingMfaRoute>
            <DeferredRoute>
              <MfaSetupPage />
            </DeferredRoute>
          </PendingMfaRoute>
        ),
      },
      {
        path: "acceso-correcto",
        element: (
          <ProtectedRoute>
            <DeferredRoute>
              <AuthSuccessPage />
            </DeferredRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "accesos",
        element: (
          <ProtectedRoute>
            <DeferredRoute>
              <AccessPage />
            </DeferredRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <DeferredRoute>
              <ProfilePage />
            </DeferredRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <DeferredRoute>
            <NotFoundPage />
          </DeferredRoute>
        ),
      },
    ],
  },
]);
