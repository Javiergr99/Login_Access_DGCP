# Mejoras de Accesos disponibles y menú de perfil

## Cambios visuales

- Distribución responsive de tarjetas: una columna en móvil, dos en tablet y tres en escritorio amplio.
- Tarjetas más compactas, con jerarquía visual más clara y animaciones escalonadas.
- Resumen del usuario reducido y mejor distribuido.
- Menú de perfil enriquecido, alineado con el disparador y con animación de origen.
- Compatibilidad con `prefers-reduced-motion`.

## Corrección de desplazamiento horizontal

El menú de Radix se configuró con `modal={false}` para impedir que bloquee el scroll del documento al abrirse. También se agregó `scrollbar-gutter: stable` y scroll vertical estable en `html`, evitando que el body cambie de ancho cuando aparece o desaparece la barra de desplazamiento.
