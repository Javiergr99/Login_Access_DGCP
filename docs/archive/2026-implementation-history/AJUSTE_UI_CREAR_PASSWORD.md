# Ajuste visual — Crear contraseña

Este parche corrige la composición visual observada en `/crear-password`.

## Causa

`AuthLayout` ya proporciona la composición institucional:

- imagen/hero a la izquierda;
- contenido de autenticación a la derecha.

La página de crear contraseña estaba añadiendo una segunda cuadrícula interna con
otro hero descriptivo y otra columna para la tarjeta. Dentro del panel derecho
esto provocaba:

- texto blanco sobre fondo blanco;
- tarjeta comprimida y desplazada;
- jerarquía visual duplicada;
- exceso de espacio vertical.

## Cambios

- Elimina el hero duplicado dentro de `CreatePasswordPage`.
- Centra una única tarjeta en el panel derecho.
- Ancho máximo de 500 px.
- Mejor jerarquía de título, descripción y aviso de seguridad.
- Inputs y botón alineados con el estilo del portal.
- Requisitos más compactos y legibles.
- Medidor con estados de color semánticos.
- Estados de éxito/error mantienen exactamente el mismo ancho visual.
- No cambia ningún endpoint, validación, token, hook o contrato backend.

## Aplicación

Desde la raíz de `mesa-ayuda-auth-2.0`:

```powershell
Expand-Archive -Path "$env:USERPROFILE\Downloads\mesa-ayuda-auth-CREAR-PASSWORD-UI.zip" -DestinationPath "." -Force
```

Después:

```powershell
npm run typecheck
npm run test
npm run build
npm run dev
```

Probar:

```text
http://127.0.0.1:5174/crear-password?token=PRUEBA
```
