<a id="top"></a>

<div align="center">

<img
  src="./docs/assets/mesa-ayuda-banner.svg"
  alt="Mesa de Ayuda 2.0 — gestión operativa, seguimiento y atención institucional"
  width="100%"
/>

<br />

<p>
  <strong>Frontend operativo de Mesa de Ayuda del Ecosistema Integral DGCP.</strong>
</p>

<p>
  Dashboard · Atenciones · Seguimiento · Organizador · Perfil · Integración institucional
</p>

<p>
  <img src="https://img.shields.io/badge/Frontend-saneado-22C55E?style=for-the-badge" alt="Frontend saneado" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=0F172A" alt="React 19.2" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 6" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
</p>

<p>
  <img src="https://img.shields.io/badge/React_Doctor-100%2F100-22C55E?style=for-the-badge&logo=react&logoColor=white" alt="React Doctor 100 de 100" />
  <img src="https://img.shields.io/badge/Tests-29%2F29-22C55E?style=for-the-badge&logo=vitest&logoColor=white" alt="29 de 29 tests" />
  <img src="https://img.shields.io/badge/UTF--8-sin_BOM-0EA5E9?style=for-the-badge" alt="UTF-8 sin BOM" />
</p>

<p>
  <a href="#-vista-previa"><strong>Vista previa</strong></a>
  ·
  <a href="#-arquitectura"><strong>Arquitectura</strong></a>
  ·
  <a href="#-capacidades-del-producto"><strong>Capacidades</strong></a>
  ·
  <a href="#-stack-tecnológico"><strong>Stack</strong></a>
  ·
  <a href="#-arquitectura-del-código"><strong>Código</strong></a>
</p>

</div>

---

## ✨ Descripción

**Mesa de Ayuda 2.0** es el frontend operativo de atención y seguimiento dentro del
**Ecosistema Integral DGCP**.

Su función es concentrar los flujos de registro, consulta y seguimiento de atenciones
en una experiencia modular, consistente y preparada para integrarse con los servicios
institucionales del ecosistema.

<table>
<tr>
<td width="33%" align="center" valign="top">

### 📊 Operación

Dashboard, indicadores y contexto general de trabajo.

</td>
<td width="33%" align="center" valign="top">

### 🧾 Atenciones

Registro, consulta y trazabilidad de solicitudes.

</td>
<td width="33%" align="center" valign="top">

### 🧭 Seguimiento

Filtros, detalle, historial y continuidad operativa.

</td>
</tr>
</table>

---

## 🖼️ Vista previa

<table>
  <tr>
    <td align="center"><strong>Seguimiento de atenciones</strong></td>
    <td align="center"><strong>Registro de atención</strong></td>
  </tr>
  <tr>
    <td width="50%">
      <img
        src="./docs/assets/seguimiento.png"
        alt="Pantalla de seguimiento de atenciones de Mesa de Ayuda 2.0"
      />
    </td>
    <td width="50%">
      <img
        src="./docs/assets/registrar-atencion.png"
        alt="Formulario de registro de atención de Mesa de Ayuda 2.0"
      />
    </td>
  </tr>
</table>

<p align="center">
  <sub>Los nombres y datos visibles en las capturas son demostrativos.</sub>
</p>

---

## 🏗️ Arquitectura

<p align="center">
  <img
    src="./docs/assets/mesa-ayuda-architecture.svg"
    alt="Arquitectura de Mesa de Ayuda 2.0 dentro del Ecosistema Integral DGCP"
    width="100%"
  />
</p>

<table>
<tr>
<td width="25%" align="center" valign="top">

<strong>01 · ENTRADA</strong>

<br /><br />

El usuario se autentica en Login Universal.

</td>
<td width="25%" align="center" valign="top">

<strong>02 · HANDOFF</strong>

<br /><br />

Mesa recibe un <code>redirect-code</code> de un solo uso.

</td>
<td width="25%" align="center" valign="top">

<strong>03 · SESIÓN</strong>

<br /><br />

Se intercambia el código y el access token vive en memoria.

</td>
<td width="25%" align="center" valign="top">

<strong>04 · OPERACIÓN</strong>

<br /><br />

Mesa consume su API para atender el dominio operativo.

</td>
</tr>
</table>

<p align="center">
  <img src="https://img.shields.io/badge/Login-independiente-2563EB?style=flat-square" alt="Login independiente" />
  <img src="https://img.shields.io/badge/Redirect--code-7C3AED?style=flat-square" alt="Redirect code" />
  <img src="https://img.shields.io/badge/Access_token-en_memoria-059669?style=flat-square" alt="Access token en memoria" />
  <img src="https://img.shields.io/badge/API-operativa-C2410C?style=flat-square" alt="API operativa" />
</p>

---

## 🧩 Capacidades del producto

<table>
<tr>
<td width="33%" valign="top">

<strong>📊 Dashboard</strong>

<br /><br />

Resumen operativo, métricas y visualizaciones para el trabajo diario.

<br /><br />

<code>dashboard</code> · <code>query</code> · <code>metrics</code>

</td>
<td width="33%" valign="top">

<strong>📝 Registro</strong>

<br /><br />

Captura estructurada de nuevas atenciones con validaciones y adjuntos.

<br /><br />

<code>forms</code> · <code>schemas</code> · <code>files</code>

</td>
<td width="33%" valign="top">

<strong>🔎 Seguimiento</strong>

<br /><br />

Consulta, filtros, paginación, detalle e historial de atenciones.

<br /><br />

<code>tracking</code> · <code>filters</code> · <code>history</code>

</td>
</tr>
<tr>
<td width="33%" valign="top">

<strong>🗓️ Organizador</strong>

<br /><br />

Vista de apoyo para organización y continuidad de actividades.

<br /><br />

<code>organizer</code> · <code>workflow</code>

</td>
<td width="33%" valign="top">

<strong>👤 Perfil</strong>

<br /><br />

Información administrativa del usuario y estado de seguridad.

<br /><br />

<code>profile</code> · <code>security</code>

</td>
<td width="33%" valign="top">

<strong>🔐 Autenticación integrada</strong>

<br /><br />

Entrada mediante redirect-code, guards e inactividad.

<br /><br />

<code>auth</code> · <code>session</code> · <code>guards</code>

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

<img src="https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19.2" />
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
<img src="https://img.shields.io/badge/Testing_Library-components-E33332?style=flat-square&logo=testinglibrary&logoColor=white" alt="Testing Library" />
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
    src="./docs/assets/mesa-ayuda-code-map.svg"
    alt="Mapa visual de la organización del código de Mesa de Ayuda 2.0"
    width="100%"
  />
</p>

<details>
<summary><strong>Explorar estructura técnica</strong></summary>

<br />

```text
src/
├── app/
│   ├── providers/
│   ├── router/
│   └── styles/
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── attention-create/
│   ├── attentions/
│   ├── auth/
│   ├── dashboard/
│   ├── organizer/
│   ├── placeholders/
│   ├── profile/
│   └── tracking/
├── shared/
│   ├── api/
│   ├── catalogs/
│   ├── config/
│   ├── files/
│   ├── lib/
│   ├── navigation/
│   └── permissions/
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

## 🎨 Diseño

<div align="center">

<p>
  La interfaz se diseñó como parte del sistema visual del <strong>Ecosistema Integral DGCP</strong>,
  manteniendo consistencia entre layout, navegación, componentes y estados.
</p>

<p>
  <img src="https://img.shields.io/badge/Figma-QajWuVBDoFpZ4bSQqI4ZML-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Referencia Figma Mesa de Ayuda 2.0" />
</p>

</div>

---

## 👨‍💻 Autor

<div align="center">

<br />

<img
  src="https://github.com/Javiergr99.png"
  width="92"
  height="92"
  alt="Javier Garcia"
/>

### Javier Garcia

**Programador Jr · Frontend Developer · UX/UI**

Diseño y desarrollo de interfaces modulares, consistentes y orientadas a producto.

<br />

<a href="https://github.com/Javiergr99">
  <img src="https://img.shields.io/badge/GitHub-Javiergr99-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub de Javier Garcia" />
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
