# Sistema de diseño — Mesa de Ayuda Auth 2.0

El proyecto utiliza **Design Tokens** mediante variables CSS, temas semánticos y componentes atómicos.

## Archivos principales

```text
src/app/styles/
├── tokens.css       # Paleta primitiva, tipografía, espacios, radios, sombras y capas
├── themes.css       # Temas auth y mesa-ayuda; tonos de accesos, estados y badges
├── typography.css   # Clases tipográficas semánticas
└── index.css        # Importación global y reglas compartidas

src/shared/theme/
├── theme.types.ts
├── theme.constants.ts
└── theme-scope.tsx
```

## Cambiar todos los botones del login

Editar `src/app/styles/themes.css`:

```css
[data-theme="auth"] {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-pressed: #1e40af;
  --color-primary-soft: #eff6ff;
}
```

Los botones, enlaces, focus, checkbox, campos y elementos principales del flujo de autenticación tomarán los nuevos valores.

## Cambiar el color principal de Mesa de Ayuda

```css
[data-theme="mesa-ayuda"] {
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-pressed: #1e40af;
}
```

## Cambiar el peso global de los títulos

```css
[data-theme="auth"],
[data-theme="mesa-ayuda"] {
  --font-weight-page-title: var(--font-weight-extrabold);
  --font-weight-section-title: var(--font-weight-bold);
  --font-weight-card-title: var(--font-weight-bold);
}
```

## Cambiar la familia tipográfica

Editar `src/app/styles/tokens.css`:

```css
:root {
  --font-family-primary: "Inter", "Segoe UI", Arial, sans-serif;
  --font-family-institutional: "Noto Sans", Arial, sans-serif;
}
```

## Cambiar Header y Footer de Gobierno de México

```css
:root {
  --gobmx-header-background: #621132;
  --gobmx-footer-background: #611232;
}
```

Estos tokens son independientes del color de los botones del login.

## Cambiar los colores de las tarjetas de acceso

Los cuatro tonos se encuentran en `themes.css`:

```css
.access-tone-blue { ... }
.access-tone-violet { ... }
.access-tone-emerald { ... }
.access-tone-amber { ... }
```

Cada tarjeta solo declara su tono. El ícono, badge, enlace, borde hover y botón consumen las mismas variables del tono.

## Regla de mantenimiento

Evitar colores directos dentro de componentes:

```tsx
// Evitar
<Button className="bg-[#611232]" />

// Correcto
<Button variant="primary" />
```

Evitar pesos directos para títulos:

```tsx
// Correcto
<Typography as="h1" variant="pageTitle">
  Accesos disponibles
</Typography>
```

El tema activo lo establece cada layout mediante `ThemeScope`:

```tsx
<ThemeScope theme="auth">...</ThemeScope>
<ThemeScope theme="mesa-ayuda">...</ThemeScope>
```
