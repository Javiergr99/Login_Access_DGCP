# Configuración de redirecciones

`POST /auth/redirect-code` acepta únicamente destinos autorizados por
`auth_service`. La coincidencia debe respetar protocolo, host, puerto y ruta.

## Desarrollo local

```env
VITE_MESA_AYUDA_URL=http://127.0.0.1:5173/app/dashboard
VITE_FORMATO_NNA_URL=http://127.0.0.1:5173/app/formato-nna
VITE_ADMIN_URL=http://127.0.0.1:5173/app/usuarios
```

No mezclar `localhost` con `127.0.0.1`. Los destinos configurados no deben
contener `code`, query arbitraria, fragmentos o credenciales.

## Allowlist

```powershell
npm run redirects:allowlist
```

El comando construye el valor exacto que backend debe admitir.

## Flujo

1. Auth obtiene un destino limpio.
2. `POST /auth/redirect-code`.
3. Backend valida allowlist.
4. Auth agrega `code` y la preferencia no sensible `persistence`.
5. El destino limpia inmediatamente esos parámetros.
6. `POST /auth/exchange-code`.
7. Access token a memoria; actualmente el refresh token llega por JSON y se persiste de forma transitoria. El contrato objetivo lo moverá a cookie HttpOnly.
8. `GET /users/me`.

Un `OPTIONS 200` seguido de `POST 403` normalmente indica que la preflight fue
aceptada pero el backend rechazó la operación, por ejemplo por un destino fuera
de allowlist. Revise el código de error de la respuesta antes de atribuirlo a
CORS.
