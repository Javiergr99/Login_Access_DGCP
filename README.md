<div align="center">

Login Access

Autenticación y acceso centralizado · Ecosistema Integral DGCP

Frontend encargado del inicio de sesión, verificación MFA, recuperación de acceso y distribución de usuarios hacia los módulos autorizados del ecosistema.

</div>

Descripción

login_admin funciona como punto de entrada autenticado del Ecosistema Integral DGCP. Centraliza la validación de identidad y presenta únicamente los accesos habilitados para cada usuario antes de redirigirlo al frontend correspondiente.

Capacidades principales

Inicio de sesión y recuperación de acceso.

Creación y restablecimiento de contraseña.

Configuración y verificación MFA/TOTP.

Consulta de usuario, permisos y módulos autorizados.

Redirección segura mediante redirect-code.

Gestión de sesión, inactividad y cierre sincronizado.

Estados de carga, error, cuenta bloqueada y sesión expirada.

Tecnologías

<div align="center">

</div>

Diseño

La referencia visual y funcional del frontend se mantiene en Figma:

Abrir diseño Login Access en Figma

Ejecución local

Requisitos recomendados: Node.js 24 y npm 11.

npm install
npm run dev

Frontend local:

http://127.0.0.1:5174

Servicio de autenticación esperado:

http://127.0.0.1:8001

La configuración versionable se documenta en .env.example. Los archivos .env y .env.local son locales y no deben versionarse.

Calidad

Estado validado del frontend:

Validación

Resultado

Encoding

176 archivos UTF-8 sin BOM ni mojibake

Estructura

139 archivos TypeScript / 0 imports locales faltantes

TypeScript

Correcto

ESLint

Correcto

Tests unitarios

29/29

Build

Correcto

E2E mock

1/1

npm audit

0 vulnerabilidades

React Doctor

72/100 · 1 hallazgo de seguridad conocido

npm run quality
npm run test:e2e

Pendiente de integración: el contrato actual de auth_service todavía entrega el refresh_token por JSON, por lo que el frontend lo conserva temporalmente en Web Storage. La arquitectura objetivo moverá el refresh token a una cookie HttpOnly, Secure y SameSite; después de esa migración se revalidarán React Doctor y el E2E real.

Desarrollado como frontend independiente dentro del Ecosistema Integral DGCP.
