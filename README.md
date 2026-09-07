<a id="top"></a>

<div align="center">

<img
  src="./docs/assets/login-access-banner.svg"
  alt="Login Access — autenticación, MFA y distribución de accesos del Ecosistema Integral DGCP"
  width="100%"
/>

<br />

<p>
  <strong>Frontend central de autenticación y distribución de accesos del Ecosistema Integral DGCP.</strong>
</p>

<p>
  Login · MFA/TOTP · recuperación de acceso · sesión · permisos · SSO · redirección segura
</p>

<p>
  <img src="https://img.shields.io/badge/Frontend-saneado-22C55E?style=for-the-badge" alt="Frontend saneado" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0F172A" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
</p>

<p>
  <img src="https://img.shields.io/badge/Auth-v2-059669?style=for-the-badge" alt="Auth v2" />
  <img src="https://img.shields.io/badge/React_Doctor-100%2F100-22C55E?style=for-the-badge&logo=react&logoColor=white" alt="React Doctor 100 de 100" />
  <img src="https://img.shields.io/badge/Unit_Tests-32%2F32-22C55E?style=for-the-badge&logo=vitest&logoColor=white" alt="32 de 32 pruebas unitarias" />
</p>

<p>
  <a href="https://www.figma.com/design/ZPiqqx5Ml36Nmj5sz2Z6o6/Login-Access?node-id=0-1&t=Xhj2g0gqPsS7Qqtr-1">
    <img src="https://img.shields.io/badge/Dise%C3%B1o-Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Abrir diseño en Figma" />
  </a>
  <img src="https://img.shields.io/badge/E2E_real-PASS-22C55E?style=for-the-badge&logo=playwright&logoColor=white" alt="E2E real aprobado" />
  <img src="https://img.shields.io/badge/npm_audit_prod-0_vulnerabilidades-22C55E?style=for-the-badge&logo=npm&logoColor=white" alt="npm audit producción 0 vulnerabilidades" />
  <img src="https://img.shields.io/badge/UTF--8-sin_BOM-0EA5E9?style=for-the-badge" alt="UTF-8 sin BOM" />
</p>

<p>
  <a href="#-vista-previa"><strong>Vista previa</strong></a>
  ·
  <a href="#-diseño-en-figma"><strong>Figma</strong></a>
  ·
  <a href="#️-arquitectura"><strong>Arquitectura</strong></a>
  ·
  <a href="#-seguridad-y-auth-v2"><strong>Seguridad</strong></a>
  ·
  <a href="#-stack-tecnológico"><strong>Stack</strong></a>
  ·
  <a href="#-calidad"><strong>Calidad</strong></a>
</p>

</div>

---

## ✨ Descripción

**Login Access** es el punto de entrada autenticado del **Ecosistema Integral DGCP**.

Centraliza la validación de identidad, autenticación multifactor, estado de sesión y permisos antes de mostrar al usuario los módulos que tiene autorizados.

Cada módulo operativo continúa funcionando como un frontend independiente. Login Access mantiene la autenticación centralizada y realiza el handoff hacia cada aplicación mediante un `redirect-code` temporal de un solo uso.

<table>
<tr>
<td width="33%" align="center" valign="top">

### 🔐 Identidad

Login, activación, recuperación y restablecimiento de contraseña.

</td>
<td width="33%" align="center" valign="top">

### 🛡️ Seguridad

MFA/TOTP, sesión, renovación, inactividad y cierre sincronizado.

</td>
<td width="33%" align="center" valign="top">

### 🧭 Accesos

Permisos por usuario y redirección hacia frontends autorizados.

</td>
</tr>
</table>

---

## 🖼️ Vista previa

<table>
  <tr>
    <td align="center"><strong>Inicio de sesión</strong></td>
    <td align="center"><strong>Accesos disponibles</strong></td>
  </tr>
  <tr>
    <td width="50%">
      <img
        src="./docs/assets/login-access-preview.png"
        alt="Interfaz de inicio de sesión de Login Access"
      />
    </td>
    <td width="50%">
      <img
        src="./docs/assets/login-access-accesos-preview.png"
        alt="Interfaz de accesos disponibles de Login Access"
      />
    </td>
  </tr>
</table>

<p align="center">
  <sub>
    Flujo de autenticación y distribución de accesos. Los datos representados en las
    interfaces son demostrativos.
  </sub>
</p>

---

## 🎨 Diseño en Figma

El archivo de **Login Access** funciona como referencia visual y funcional del producto, incluyendo estados normales, errores, seguridad, MFA y distribución de accesos.

<p align="center">
  <a href="https://www.figma.com/design/ZPiqqx5Ml36Nmj5sz2Z6o6/Login-Access?node-id=0-1&t=Xhj2g0gqPsS7Qqtr-1">
    <img src="https://img.shields.io/badge/Explorar_Login_Access-Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Explorar Login Access en Figma" />
  </a>
</p>

<table>
<tr>
<td width="33%" valign="top">

**Login**

- acceso normal;
- campos vacíos;
- credenciales incorrectas;
- cuenta bloqueada;
- sesión expirada;
- error de conexión;
- loading.

</td>
<td width="33%" valign="top">

**MFA**

- configuración TOTP;
- código QR;
- clave manual;
- verificación;
- código inválido;
- estados de seguridad.

</td>
<td width="33%" valign="top">

**Accesos**

- módulos autorizados;
- loading / skeleton;
- ausencia de permisos;
- error de carga;
- detalle de permisos;
- logout;
- toasts.

</td>
</tr>
</table>

> Figma define la referencia visual y funcional del producto. La implementación mantiene componentes, design tokens, contratos y reglas técnicas propias del frontend.

---

## 🏗️ Arquitectura

<p align="center">
  <img
    src="./docs/assets/login-access-architecture.svg"
    alt="Arquitectura de Login Access dentro del Ecosistema Integral DGCP"
    width="100%"
  />
</p>

<table>
<tr>
<td width="25%" align="center" valign="top">

<strong>01 · IDENTIDAD</strong>

<br /><br />

El usuario inicia sesión y completa MFA cuando corresponde.

</td>
<td width="25%" align="center" valign="top">

<strong>02 · AUTORIZACIÓN</strong>

<br /><br />

<code>auth_service</code> valida identidad, sesión y permisos.

</td>
<td width="25%" align="center" valign="top">

<strong>03 · ACCESOS</strong>

<br /><br />

Login Access presenta únicamente los módulos habilitados.

</td>
<td width="25%" align="center" valign="top">

<strong>04 · HANDOFF</strong>

<br /><br />

Se genera un <code>redirect-code</code> temporal hacia el frontend seleccionado.

</td>
</tr>
</table>

<p align="center">
  <img src="https://img.shields.io/badge/Frontends-independientes-0F172A?style=flat-square" alt="Frontends independientes" />
  <img src="https://img.shields.io/badge/Auth-centralizada-2563EB?style=flat-square" alt="Autenticación centralizada" />
  <img src="https://img.shields.io/badge/MFA-TOTP-7C3AED?style=flat-square" alt="MFA TOTP" />
  <img src="https://img.shields.io/badge/Permisos-Backend-059669?style=flat-square" alt="Permisos desde Backend" />
  <img src="https://img.shields.io/badge/Handoff-redirect--code-F59E0B?style=flat-square" alt="Handoff mediante redirect-code" />
</p>

---

## 🧩 Capacidades del producto

<table>
<tr>
<td width="33%" valign="top">

<strong>🔐 Autenticación</strong>

<br /><br />

Login, activación de cuenta, recuperación y restablecimiento de contraseña.

<br /><br />

<code>auth</code> · <code>schemas</code> · <code>guards</code>

</td>
<td width="33%" valign="top">

<strong>🛡️ MFA / TOTP</strong>

<br /><br />

Configuración mediante QR, clave manual y validación de códigos temporales.

<br /><br />

<code>setup</code> · <code>verify</code> · <code>TOTP</code>

</td>
<td width="33%" valign="top">

<strong>⏱️ Sesión</strong>

<br /><br />

Control de inactividad, access token en memoria, refresh HttpOnly y cierre sincronizado.

<br /><br />

<code>session</code> · <code>BroadcastChannel</code>

</td>
</tr>
<tr>
<td width="33%" valign="top">

<strong>🧭 Permisos</strong>

<br /><br />

Consulta de módulos disponibles y acciones autorizadas por usuario.

<br /><br />

<code>accesses</code> · <code>permissions</code>

</td>
<td width="33%" valign="top">

<strong>↗️ Navegación segura</strong>

<br /><br />

Guards, destinos controlados y handoff mediante <code>redirect-code</code>.

<br /><br />

<code>router</code> · <code>redirect</code>

</td>
<td width="33%" valign="top">

<strong>👤 Perfil</strong>

<br /><br />

Información administrativa y estado de seguridad de la cuenta.

<br /><br />

<code>profile</code> · <code>security</code>

</td>
</tr>
</table>

---

## 🔐 Seguridad y Auth v2

La integración actual de Login Access implementa el contrato **Auth v2** del Ecosistema Integral DGCP.

El objetivo es mantener las credenciales de sesión sensibles fuera de los mecanismos de almacenamiento accesibles por JavaScript.

<table>
<tr>
<td width="33%" valign="top">

<strong>🧠 Access token</strong>

<br /><br />

El access token vive únicamente en memoria y se utiliza mediante
<code>Authorization: Bearer</code>.

<br /><br />

<code>memory-only</code> · <code>Bearer</code>

</td>
<td width="33%" valign="top">

<strong>🍪 Refresh token</strong>

<br /><br />

El refresh token permanece en una cookie <code>HttpOnly</code> administrada por backend.

<br /><br />

<code>HttpOnly</code> · <code>credentials</code>

</td>
<td width="33%" valign="top">

<strong>🔄 Restauración</strong>

<br /><br />

Después de un F5, la sesión se recupera mediante <code>POST /auth/refresh</code>.

<br /><br />

<code>cookie-first</code> · <code>single-flight</code>

</td>
</tr>
<tr>
<td width="33%" valign="top">

<strong>🛡️ Web Storage</strong>

<br /><br />

Access y refresh tokens no se almacenan en <code>localStorage</code> ni <code>sessionStorage</code>.

<br /><br />

<code>zero token persistence</code>

</td>
<td width="33%" valign="top">

<strong>↗️ SSO</strong>

<br /><br />

Los módulos reciben un <code>redirect-code</code> temporal y lo intercambian por su propia sesión.

<br /><br />

<code>redirect-code</code> · <code>exchange-code</code>

</td>
<td width="33%" valign="top">

<strong>🚪 Logout</strong>

<br /><br />

El cierre de sesión revoca la sesión backend y elimina la cookie de renovación.

<br /><br />

<code>revoke</code> · <code>clear session</code>

</td>
</tr>
</table>

<p align="center">
  <img src="https://img.shields.io/badge/Access_token-memory_only-059669?style=flat-square" alt="Access token solo en memoria" />
  <img src="https://img.shields.io/badge/Refresh-HttpOnly_cookie-2563EB?style=flat-square" alt="Refresh mediante cookie HttpOnly" />
  <img src="https://img.shields.io/badge/Web_Storage-zero_tokens-7C3AED?style=flat-square" alt="Cero tokens en Web Storage" />
  <img src="https://img.shields.io/badge/SSO-redirect--code-F59E0B?style=flat-square" alt="SSO mediante redirect-code" />
</p>

### Flujo Auth v2

```text
Login
  │
  ▼
POST /auth/login
  │
  ▼
MFA / TOTP
  │
  ▼
POST /auth/login/2fa
  │
  ├── access token → memoria
  └── refresh token → cookie HttpOnly
  │
  ▼
Accesos disponibles
  │
  ▼
POST /auth/redirect-code
  │
  ▼
Frontend autorizado
  │
  ▼
POST /auth/exchange-code
```

El frontend **no solicita, lee ni persiste directamente el refresh token**.

---

## 🛠️ Stack tecnológico

<div align="center">

### Core

<img
  src="https://skillicons.dev/icons?i=react,ts,tailwind,vite,html,css&theme=dark&perline=6"
  alt="React, TypeScript, Tailwind CSS, Vite, HTML y CSS"
/>

<br />
<br />

<img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
<img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 6" />
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />

</div>

<br />

<table>
<tr>
<td width="50%" valign="top">

<strong>⚙️ Estado · Datos · Formularios</strong>

<br /><br />

<img src="https://img.shields.io/badge/React_Router-navigation-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router" />
<img src="https://img.shields.io/badge/TanStack_Query-data-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query" />
<img src="https://img.shields.io/badge/Zustand-state-443E38?style=flat-square" alt="Zustand" />
<img src="https://img.shields.io/badge/React_Hook_Form-forms-EC5990?style=flat-square&logo=reacthookform&logoColor=white" alt="React Hook Form" />
<img src="https://img.shields.io/badge/Zod-validation-3E67B1?style=flat-square" alt="Zod" />
<img src="https://img.shields.io/badge/Axios-HTTP-5A29E4?style=flat-square&logo=axios&logoColor=white" alt="Axios" />

</td>
<td width="50%" valign="top">

<strong>🎛️ UI · Interacción</strong>

<br /><br />

<img src="https://img.shields.io/badge/Radix_UI-primitives-161618?style=flat-square&logo=radixui&logoColor=white" alt="Radix UI" />
<img src="https://img.shields.io/badge/Lucide_React-icons-F56565?style=flat-square&logo=lucide&logoColor=white" alt="Lucide React" />
<img src="https://img.shields.io/badge/Font_Awesome-icons-538DD7?style=flat-square&logo=fontawesome&logoColor=white" alt="Font Awesome" />
<img src="https://img.shields.io/badge/Motion-interaction-FFF312?style=flat-square&logo=framer&logoColor=111827" alt="Motion" />
<img src="https://img.shields.io/badge/Sonner-feedback-111827?style=flat-square" alt="Sonner" />

</td>
</tr>
<tr>
<td width="50%" valign="top">

<strong>🧪 Testing · Calidad</strong>

<br /><br />

<img src="https://img.shields.io/badge/Vitest-unit_tests-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" />
<img src="https://img.shields.io/badge/Playwright-E2E-2EAD33?style=flat-square&logo=playwright&logoColor=white" alt="Playwright" />
<img src="https://img.shields.io/badge/ESLint-quality-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint" />
<img src="https://img.shields.io/badge/Prettier-format-F7B93E?style=flat-square&logo=prettier&logoColor=111827" alt="Prettier" />
<img src="https://img.shields.io/badge/React_Doctor-100%2F100-22C55E?style=flat-square&logo=react&logoColor=white" alt="React Doctor 100 de 100" />

</td>
<td width="50%" valign="top">

<strong>🎨 Diseño · Tooling</strong>

<br /><br />

<img
  src="https://skillicons.dev/icons?i=figma,git,github,npm,vscode&theme=dark&perline=5"
  alt="Figma, Git, GitHub, npm y Visual Studio Code"
/>

</td>
</tr>
</table>

---

## 🗂️ Arquitectura del código

<p align="center">
  <img
    src="./docs/assets/login-access-code-map.svg"
    alt="Mapa visual de la organización del código de Login Access"
    width="100%"
  />
</p>

<details>
<summary><strong>Explorar estructura técnica</strong></summary>

<br />

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
│   ├── auth/
│   └── profile/
├── shared/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── navigation/
│   └── theme/
└── main.tsx
```

</details>

<p align="center">
  <img src="https://img.shields.io/badge/Feature--based-architecture-7C3AED?style=flat-square" alt="Feature based architecture" />
  <img src="https://img.shields.io/badge/Strict-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="Strict TypeScript" />
  <img src="https://img.shields.io/badge/Component--driven-UI-06B6D4?style=flat-square&logo=react&logoColor=white" alt="Component driven UI" />
  <img src="https://img.shields.io/badge/Typed-contracts-059669?style=flat-square" alt="Typed contracts" />
</p>

---

## ⚙️ Configuración

La configuración local se basa en `.env.example`.

Variables públicas contempladas por el frontend:

```env
VITE_API_URL=
VITE_ENABLE_MOCKS=
VITE_MESA_AYUDA_URL=
VITE_FORMATO_NNA_URL=
VITE_DIRECTORIO_PROCURADORES_URL=
VITE_CONTROL_AGENDA_URL=
VITE_ADMIN_URL=
VITE_POR_TUS_DERECHOS_URL=
VITE_GOBMX_SEARCH_URL=
VITE_FORMATO_NNA_PUBLIC_URL=
```

> `.env`, `.env.local`, contraseñas, semillas TOTP, JWT y demás secretos no deben incorporarse al repositorio.

---

## 🧪 Calidad

Login Access cuenta con un quality gate reproducible para validar código, estructura, encoding, pruebas y build.

<table>
<tr>
<td width="25%" align="center" valign="top">

<strong>Encoding</strong>

<br /><br />

UTF-8 sin BOM y validación explícita contra mojibake.

<br /><br />

<code>validate:encoding</code>

</td>
<td width="25%" align="center" valign="top">

<strong>Static analysis</strong>

<br /><br />

TypeScript, ESLint y Prettier.

<br /><br />

<code>typecheck</code> · <code>lint</code>

</td>
<td width="25%" align="center" valign="top">

<strong>Testing</strong>

<br /><br />

Pruebas unitarias y escenario E2E con autenticación real.

<br /><br />

<code>Vitest</code> · <code>Playwright</code>

</td>
<td width="25%" align="center" valign="top">

<strong>React</strong>

<br /><br />

Auditoría estructural y de buenas prácticas.

<br /><br />

<code>React Doctor 100/100</code>

</td>
</tr>
</table>

### Quality gate

```bash
npm run quality
```

Ejecuta:

```text
Encoding
   ↓
Prettier
   ↓
Structure
   ↓
TypeScript
   ↓
ESLint
   ↓
Vitest
   ↓
Build
   ↓
React Doctor
```

### Validaciones independientes

```bash
npm run validate:encoding
npm run format:check
npm run validate:structure
npm run typecheck
npm run lint
npm run test
npm run build
npm run doctor
```

### E2E real

```bash
npm run test:e2e:real
```

El escenario certificado cubre:

```text
Login
→ MFA
→ sesión
→ accesos
→ redirect-code
→ exchange-code
→ Mesa de Ayuda
→ refresh
→ F5
→ restauración de sesión
→ logout
→ ruta protegida
```

Estado actual:

<p align="center">
  <img src="https://img.shields.io/badge/Encoding-PASS-22C55E?style=flat-square" alt="Encoding PASS" />
  <img src="https://img.shields.io/badge/TypeScript-PASS-22C55E?style=flat-square" alt="TypeScript PASS" />
  <img src="https://img.shields.io/badge/ESLint-PASS-22C55E?style=flat-square" alt="ESLint PASS" />
  <img src="https://img.shields.io/badge/Vitest-32%2F32-22C55E?style=flat-square&logo=vitest&logoColor=white" alt="32 de 32 pruebas" />
  <img src="https://img.shields.io/badge/E2E_real-PASS-22C55E?style=flat-square&logo=playwright&logoColor=white" alt="E2E real PASS" />
  <img src="https://img.shields.io/badge/React_Doctor-100%2F100-22C55E?style=flat-square&logo=react&logoColor=white" alt="React Doctor 100 de 100" />
  <img src="https://img.shields.io/badge/npm_audit_prod-0-22C55E?style=flat-square&logo=npm&logoColor=white" alt="npm audit producción cero vulnerabilidades" />
</p>

> Las credenciales utilizadas por los E2E reales son configuración local sensible y nunca deben formar parte del repositorio.

---

## 👨‍💻 Autor

<div align="center">

<br />

<img
  src="https://github.com/Javiergr99.png"
  width="92"
  height="92"
  alt="Javier Garcia"
  style="border-radius:50%"
/>

### Javier Garcia

**Programador Jr · Frontend Developer · UX/UI**

Diseño y desarrollo de interfaces modulares, consistentes y orientadas a producto.

<br />

<a href="https://github.com/Javiergr99">
  <img src="https://img.shields.io/badge/GitHub-Javiergr99-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub de Javier Garcia" />
</a>

&nbsp;

<a href="https://www.figma.com/design/ZPiqqx5Ml36Nmj5sz2Z6o6/Login-Access?node-id=0-1&t=Xhj2g0gqPsS7Qqtr-1">
  <img src="https://img.shields.io/badge/Figma-Login_Access-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma Login Access" />
</a>

<br />
<br />

<img src="https://img.shields.io/badge/Code-React_%2B_TypeScript-61DAFB?style=flat-square&logo=react&logoColor=0F172A" alt="React y TypeScript" />
<img src="https://img.shields.io/badge/Design-Figma-F24E1E?style=flat-square&logo=figma&logoColor=white" alt="Figma" />
<img src="https://img.shields.io/badge/Focus-Frontend_Architecture-7C3AED?style=flat-square" alt="Frontend Architecture" />

<br />
<br />

<a href="#top"><strong>Volver al inicio ↑</strong></a>

</div>
