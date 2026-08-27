# Integración con auth_service

## Configuración local

```env
VITE_API_URL=http://127.0.0.1:8001
VITE_ENABLE_MOCKS=false
```

Use el puerto donde realmente se ejecute `auth_service`.

## Login

`POST /auth/login` utiliza `application/x-www-form-urlencoded`:

```text
username=<CURP>
password=<PASSWORD>
```

El formulario expone `curp`; el servicio lo normaliza y lo envía como
`username`.

## MFA

### Setup inicial

```text
POST /auth/login
  -> two_factor_setup_required
POST /auth/setup
  -> qr_uri + manual_key
POST /auth/enable
```

`qr_uri` y `manual_key` viven únicamente en memoria.

### Verificación recurrente

```text
POST /auth/login
  -> pending_2fa
POST /auth/login/2fa
```

`temp_token` también vive únicamente en memoria.

## Sesión definitiva

Después de `/auth/enable`, `/auth/login/2fa` o `/auth/exchange-code`:

- el frontend conserva el `access_token` en memoria;
- el contrato vigente de `auth_service` devuelve también el `refresh_token` por
  JSON y el frontend lo conserva temporalmente en Web Storage;
- se consulta `GET /users/me` con Bearer.

La eliminación del refresh token del almacenamiento accesible a JavaScript está pendiente de la migración de `auth_service` a cookie HttpOnly.

## Renovación

Las peticiones protegidas usan un interceptor central:

1. request con access token;
2. `401` elegible;
3. una única promesa ejecuta `/auth/refresh`;
4. durante el contrato transitorio, el frontend envía explícitamente el `refresh_token` almacenado; con el contrato objetivo, la cookie HttpOnly viajará automáticamente;
5. backend rota/valida la sesión;
6. el nuevo access token reemplaza al anterior en memoria;
7. el request original se reintenta una sola vez.

Los endpoints de login/MFA/refresh/logout no entran en bucles de refresh.

## Preferencia de sesión

Mientras permanezca el contrato transitorio, “Mantener mi sesión iniciada”
determina el almacenamiento temporal del refresh token (`sessionStorage` o
`localStorage`) además del marcador de persistencia. Cuando `auth_service`
migre a cookie HttpOnly, esta preferencia volverá a controlar únicamente la
duración de la sesión y el header:

```text
X-Remember-Session: true | false
```

El backend decide si la cookie refresh recibe duración persistente o queda
limitada a la sesión del navegador.

## Usuario y permisos

```http
GET /users/me
Authorization: Bearer <access_token>
```

Los accesos se construyen desde:

```text
permisos.grupos
└── modulos
    └── acciones
```

Nombres estables de grupos/acciones deciden visibilidad; los UUID no son la
regla de negocio visual.

## Errores

El normalizador soporta errores directos, `detail` anidado y respuestas de
validación FastAPI sin exponer payloads sensibles en logs.
