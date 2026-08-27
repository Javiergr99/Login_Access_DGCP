# Header y footer institucionales GobMx

## Objetivo

Esta adaptación reutiliza el diseño del header y footer de Medidas de Protección
2.0 dentro del proyecto independiente de autenticación de Mesa de Ayuda 2.0.
La implementación se migró de JSX + Material UI a TSX + Tailwind CSS, Radix UI,
Lucide y Font Awesome, manteniendo la composición visual y el comportamiento
responsive.

## Recursos requeridos

Copia los siguientes archivos:

```text
public/assets/images/gobmx-logo.png
public/assets/images/footer-textura.png
```

No es necesario copiar `Logos-SNDIF.png`, `Logo_portusderechos.png`,
`perfil.svg` ni `perfil.webp`, porque los componentes proporcionados no los
utilizan.

## Componentes

```text
src/components/layout/gobmx/
├── gobmx-header.tsx
├── gobmx-header-logo.tsx
├── gobmx-desktop-nav.tsx
├── gobmx-mobile-menu-button.tsx
├── gobmx-mobile-drawer.tsx
├── gobmx-mobile-drawer-item.tsx
├── gobmx-search-button.tsx
├── gobmx-footer.tsx
├── gobmx-footer-link-group.tsx
├── gobmx-social-links.tsx
├── gobmx-layout.constants.ts
├── gobmx-layout.types.ts
└── use-gobmx-header.ts
```

## Configuración

Define en `.env` la dirección pública de Por Tus Derechos:

```env
VITE_POR_TUS_DERECHOS_URL=https://direccion-publica-del-sitio
```

Los accesos de Trámites, Gobierno y búsqueda de gob.mx ya cuentan con sus rutas
públicas predeterminadas.
