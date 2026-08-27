# Mejora del diálogo de permisos

El diálogo de permisos ahora respeta la altura disponible del viewport y mantiene el encabezado y el pie visibles.

Cambios principales:

- Altura máxima basada en `100dvh`.
- Scroll interno únicamente en el cuerpo del diálogo.
- Encabezado y acciones fijos dentro del modal.
- Lista de permisos en dos columnas desde tablet/escritorio.
- Contador total de permisos.
- Diseño de una sola columna en móvil.
- Animación de apertura más ligera.

La mejora se implementó en el componente atómico `Dialog`, por lo que también protege otros diálogos extensos del proyecto.
