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
  Login · MFA/TOTP · recuperación de acceso · sesión · permisos · redirección segura
</p>

<p>
  <img src="https://img.shields.io/badge/Frontend-saneado-22C55E?style=for-the-badge" alt="Frontend saneado" />
  <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=0F172A" alt="React 19.2.8" />
  <img src="https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 6.0.3" />
  <img src="https://img.shields.io/badge/Vite-8.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8.2.0" />
</p>

<p>
  <a href="https://www.figma.com/design/ZPiqqx5Ml36Nmj5sz2Z6o6/Login-Access?node-id=0-1&t=Xhj2g0gqPsS7Qqtr-1">
    <img src="https://img.shields.io/badge/Dise%C3%B1o-Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Abrir diseño en Figma" />
  </a>
  <img src="https://img.shields.io/badge/npm_audit-0_vulnerabilidades-22C55E?style=for-the-badge&logo=npm&logoColor=white" alt="npm audit 0 vulnerabilidades" />
  <img src="https://img.shields.io/badge/Tests-29%2F29-22C55E?style=for-the-badge&logo=vitest&logoColor=white" alt="29 de 29 tests" />
</p>

<p>
  <a href="#-vista-previa"><strong>Vista previa</strong></a>
  ·
  <a href="#-diseño-en-figma"><strong>Figma</strong></a>
  ·
  <a href="#️-arquitectura"><strong>Arquitectura</strong></a>
  ·
  <a href="#-stack-tecnológico"><strong>Stack</strong></a>
</p>

</div>

---

## ✨ Descripción

**Login Access** es el punto de entrada autenticado del **Ecosistema Integral DGCP**.

Centraliza la validación de identidad, MFA y permisos antes de mostrar al usuario los
módulos que tiene autorizados. Cada módulo operativo continúa siendo un frontend
independiente; Login Access se ocupa de la autenticación y de entregar un
`redirect-code` hacia el destino seleccionado.

<table>
<tr>
<td width="33%" align="center" valign="top">

### 🔐 Identidad

Login, activación, recuperación y restablecimiento de contraseña.

</td>
<td width="33%" align="center" valign="top">

### 🛡️ Seguridad

MFA/TOTP, inactividad, sesión y cierre sincronizado.

</td>
<td width="33%" align="center" valign="top">

### 🧭 Accesos

Permisos por usuario y redirección a frontends autorizados.

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

El archivo de **Login Access** funciona como referencia visual y funcional del producto,
incluyendo estados normales, errores, seguridad y accesos.

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

> Figma define la referencia de producto. La implementación mantiene componentes,
> design tokens y reglas técnicas propias del frontend.

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

Usuario inicia sesión y completa MFA cuando corresponde.

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

Se genera un <code>redirect-code</code> hacia el frontend seleccionado.

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

Configuración mediante QR y validación de códigos de seis dígitos.

<br /><br />

<code>setup</code> · <code>verify</code> · <code>OTP</code>

</td>
<td width="33%" valign="top">

<strong>⏱️ Sesión</strong>

<br /><br />

Control de inactividad, access token en memoria y cierre sincronizado.

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

Guards, destinos controlados y entrega mediante <code>redirect-code</code>.

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

## 🛠️ Stack tecnológico

<div align="center">

### Core

<img
  src="https://skillicons.dev/icons?i=react,ts,tailwind,vite,html,css&theme=dark&perline=6"
  alt="React, TypeScript, Tailwind CSS, Vite, HTML y CSS"
/>

<br />
<br />

<img src="https://img.shields.io/badge/React-19.2.8-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19.2.8" />
<img src="https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 6.0.3" />
<img src="https://img.shields.io/badge/Vite-8.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8.2.0" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4.3.3" />

</div>

<br />

<table>
<tr>
<td width="50%" valign="top">

<strong>⚙️ Estado · Datos · Formularios</strong>

<br /><br />

<img src="https://img.shields.io/badge/React_Router-8.3.0-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router 8.3.0" />
<img src="https://img.shields.io/badge/TanStack_Query-5.101.4-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query 5.101.4" />
<img src="https://img.shields.io/badge/Zustand-5.0.14-443E38?style=flat-square" alt="Zustand 5.0.14" />
<img src="https://img.shields.io/badge/React_Hook_Form-7.84.0-EC5990?style=flat-square&logo=reacthookform&logoColor=white" alt="React Hook Form 7.84.0" />
<img src="https://img.shields.io/badge/Zod-4.4.3-3E67B1?style=flat-square" alt="Zod 4.4.3" />
<img src="https://img.shields.io/badge/Axios-1.19.0-5A29E4?style=flat-square&logo=axios&logoColor=white" alt="Axios 1.19.0" />

</td>
<td width="50%" valign="top">

<strong>🎛️ UI · Interacción</strong>

<br /><br />

<img src="https://img.shields.io/badge/Radix_UI-161618?style=flat-square&logo=radixui&logoColor=white" alt="Radix UI" />
<img src="https://img.shields.io/badge/Lucide_React-0.536.0-F56565?style=flat-square&logo=lucide&logoColor=white" alt="Lucide React 0.536.0" />
<img src="https://img.shields.io/badge/Font_Awesome-7.3.1-538DD7?style=flat-square&logo=fontawesome&logoColor=white" alt="Font Awesome 7.3.1" />
<img src="https://img.shields.io/badge/Motion-12.43.0-FFF312?style=flat-square&logo=framer&logoColor=111111" alt="Motion 12.43.0" />

</td>
</tr>
<tr>
<td width="50%" valign="top">

<strong>🧪 Testing · Calidad</strong>

<br /><br />

<img src="https://img.shields.io/badge/Vitest-4.1.10-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest 4.1.10" />
<img src="https://img.shields.io/badge/Playwright-1.62.1-2EAD33?style=flat-square&logo=playwright&logoColor=white" alt="Playwright 1.62.1" />
<img src="https://img.shields.io/badge/ESLint-9.39.5-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint 9.39.5" />
<img src="https://img.shields.io/badge/Prettier-3.9.6-F7B93E?style=flat-square&logo=prettier&logoColor=111827" alt="Prettier 3.9.6" />
<img src="https://img.shields.io/badge/React_Doctor-Auditor%C3%ADa-22C55E?style=flat-square&logo=react&logoColor=white" alt="React Doctor" />

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
