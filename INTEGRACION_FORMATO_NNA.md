# Destino Formato de NNA

La tarjeta **Formato de NNA** del hub de accesos utiliza el flujo seguro ya existente de `auth_service`:

1. interpreta `usuario.permisos.grupos`;
2. construye la tarjeta cuando existe `FORMATOS_ATENCIONES` con acciones;
3. solicita `POST /auth/redirect-code` para el destino limpio configurado;
4. navega al frontend independiente de Formato de NNA con `code` y `persistence`.

Destino local configurado:

`http://127.0.0.1:5175/app/dashboard`

`auth_service` debe incluir exactamente ese valor en `ALLOWED_REDIRECT_URLS`.
