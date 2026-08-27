# Contrato de redirección segura

## Endpoints

- `POST /auth/redirect-code`
- `POST /auth/exchange-code`
- `GET /users/me`

## Allowlist local

```env
ALLOWED_REDIRECT_URLS=http://127.0.0.1:5173/app/dashboard,http://127.0.0.1:5173/app/formato-nna,http://127.0.0.1:5173/app/usuarios
```

## Flujo

1. El usuario completa login y MFA en Auth.
2. Auth envía un `redirect_url` limpio a `/auth/redirect-code`.
3. Backend valida coincidencia exacta y crea un código temporal de un solo uso.
4. Auth navega al destino con `code` y `persistence`.
5. El frontend destino verifica que la ruta sea una entrada autorizada.
6. La URL se limpia inmediatamente.
7. Se ejecuta `/auth/exchange-code`.
8. El access token devuelto se conserva únicamente en memoria.
9. El contrato vigente devuelve el refresh token por JSON y el frontend lo persiste temporalmente; la migración a cookie HttpOnly administrada por Backend permanece pendiente.
10. `GET /users/me` hidrata la sesión.

Los JWT no se transportan en la URL. El access token permanece exclusivamente en memoria; el refresh token continúa temporalmente en Web Storage hasta la migración HttpOnly de Backend.

## Entradas autorizadas

```text
/app/dashboard
/app/formato-nna
/app/usuarios
```

## Validaciones de frontend

- URL absoluta HTTP/HTTPS.
- Sin credenciales embebidas.
- Sin query/hash en el destino registrado.
- Destinos centralizados y no duplicados.
- Intercambio únicamente desde entradas autorizadas.
- Rechazo de códigos vacíos/duplicados y parámetros inesperados.
- Limpieza inmediata del código.
- Manejo de `REDIRECT_URL_NOT_ALLOWED`.

## Verificación local

```powershell
npm run redirects:validate
```
