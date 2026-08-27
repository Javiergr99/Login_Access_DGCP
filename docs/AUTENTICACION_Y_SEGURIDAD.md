# Autenticación y seguridad

## Modelo vigente

El portal aplica un modelo híbrido:

- **access token:** JWT en memoria JavaScript;
- **refresh token:** actualmente recibido por JSON y persistido temporalmente en Web Storage; la arquitectura objetivo delega su custodia a `auth_service` mediante cookie `HttpOnly`;
- **Bearer:** continúa protegiendo las APIs que validan permisos desde el access JWT;
- **preferencia de persistencia:** marcador no sensible en `sessionStorage` o `localStorage`;
- **desafío MFA:** `temp_token` únicamente en memoria.

Este diseño evita convertir las APIs protegidas en autenticación por cookie
ambiental y mantiene el contrato de autorización Bearer.

## Login y MFA

```text
POST /auth/login
    ↓
temp_token
    ├── POST /auth/setup -> QR -> POST /auth/enable
    └── POST /auth/login/2fa
    ↓
access token + refresh_token JSON
```

### Nunca persistir

- contraseña;
- código TOTP;
- `temp_token`;
- `qr_uri`;
- `manual_key`;
- access token;
- refresh token fuera del periodo transitorio de compatibilidad descrito en la siguiente sección;
- respuestas completas de endpoints sensibles.

El `temp_token` se pierde intencionalmente si el usuario recarga durante MFA;
el guard lo devuelve al login para iniciar una transacción nueva.

## Access token

El access token:

- se guarda únicamente en una variable en memoria;
- se añade como `Authorization: Bearer`;
- desaparece al recargar/cerrar el contexto;
- se reemplaza después de un refresh exitoso.

El access token no tiene fallback a Web Storage.

## Refresh token

El contrato de `auth_service` todavía entrega el `refresh_token` en el cuerpo
JSON. Mientras ese contrato permanezca vigente, el frontend:

- lee el `refresh_token` de la respuesta;
- lo persiste en `sessionStorage` para una sesión normal;
- lo persiste en `localStorage` cuando el usuario solicita una sesión persistente;
- lo envía explícitamente a `/auth/refresh` y `/auth/logout`.

Este comportamiento es transitorio y explica el hallazgo de React Doctor
**Auth token in web storage**.

La arquitectura objetivo requiere que `auth_service`:

- establezca el refresh token como cookie `HttpOnly`;
- lo lea directamente en `/auth/refresh` y `/auth/logout`;
- rote/revoque la sesión en Backend;
- determine la duración mediante la preferencia enviada en
  `X-Remember-Session`.

Una vez implementado ese contrato, el frontend dejará de leer o persistir el
refresh token.

Las peticiones de sesión usan credenciales incluidas (`withCredentials` /
`credentials: include`).

## Restauración tras F5

1. el access token desaparece;
2. el marcador no sensible indica que existe una sesión potencial;
3. `/users/me` inicia la comprobación;
4. si el request protegido devuelve `401`, un refresh único utiliza temporalmente el `refresh_token` almacenado y lo envía en el cuerpo de `/auth/refresh`;
5. el nuevo access token vuelve a memoria;
6. la petición original se reintenta;
7. el usuario vuelve a estado autenticado.

Las renovaciones concurrentes comparten una única promesa de refresh.

## Logout

El logout:

- solicita `/auth/logout`;
- limpia access token, marcador, estado Zustand y caché;
- continúa limpiando el frontend aunque el request remoto falle;
- sincroniza el cierre mediante `BroadcastChannel`.

## Inactividad

Una sesión autenticada se cierra automáticamente después de **60 minutos** sin
actividad relevante.

## Autorización

La interfaz puede ocultar rutas, tarjetas o acciones según permisos, pero cada
API debe volver a validar identidad y autorización. El frontend nunca se
considera autoridad final.

## Desarrollo local

Mantenga el mismo hostname en todos los participantes del flujo. No mezcle
`localhost` con `127.0.0.1`, porque las cookies son sensibles al host.

La configuración de `Secure`, `SameSite`, dominio y duración de la cookie
pertenece al backend y debe ajustarse por ambiente.
