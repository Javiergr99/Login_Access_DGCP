# Arquitectura — Portal Auth

## Alcance

Este frontend contiene exclusivamente autenticación, MFA, sesión, perfil y
selección de accesos. Los módulos operativos viven en
`mesa_de_ayuda`.

## Estructura

```text
src/
├── api/
├── app/
│   ├── providers/
│   ├── router/
│   └── styles/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── access/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── model/
│   │   └── pages/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── model/
│   │   ├── pages/
│   │   ├── schemas/
│   │   └── services/
│   └── profile/
└── shared/
    ├── config/
    ├── constants/
    ├── hooks/
    ├── lib/
    └── theme/
```

## Principios

- Organización por funcionalidad.
- Componentes atómicos y reutilizables.
- TanStack Query para server-state.
- Zustand para estado de autenticación estrictamente efímero.
- Access token en memoria.
- Refresh token en Web Storage únicamente durante la compatibilidad con el contrato JSON vigente; arquitectura objetivo: cookie HttpOnly administrada por `auth_service`.
- MFA temporal en memoria.
- Guards para estados públicos, MFA pendiente y sesión autenticada.
- Code splitting por rutas.
- SSO mediante código temporal, nunca mediante JWT en URL.

## Flujo

```text
CURP + password
      ↓
temp_token MFA (memoria)
      ↓
setup/verificación TOTP
      ↓
access_token (memoria)
refresh_token (JSON → Web Storage; transitorio)
      ↓
GET /users/me
      ↓
/accesos
      ↓
redirect-code
```

## Recarga

La aplicación no intenta conservar el access token durante F5. En una nueva
carga, el marcador de sesión permite iniciar la restauración. Mientras
`auth_service` mantenga el contrato JSON vigente, el frontend obtiene el
`refresh_token` desde Web Storage y lo envía a `/auth/refresh`; el nuevo access
token vuelve únicamente a memoria.

La arquitectura objetivo elimina esa persistencia de credenciales del
frontend: `auth_service` deberá administrar el refresh token mediante cookie
HttpOnly y la restauración se realizará con credenciales incluidas.

## Rutas diferidas

Las páginas se importan dinámicamente mediante `React.lazy`. Guards, error
boundary y providers permanecen en el arranque para decidir acceso antes de
renderizar las pantallas diferidas.

## Escalabilidad

Agregar un nuevo acceso no requiere duplicar la sesión. El backend entrega
grupos/módulos/acciones y el frontend transforma esa información en `AccessItem`.
