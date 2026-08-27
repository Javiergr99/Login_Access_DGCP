# Mi perfil desde Accesos disponibles

La ruta protegida `/perfil` permite consultar el perfil autenticado directamente en el Login Universal, sin crear un redirect-code ni depender de la lista blanca de aplicaciones externas.

El acceso se realiza desde el menú del usuario del header en la pantalla `/accesos`.

Características:

- Usa el usuario real cargado por `GET /users/me`.
- Es exclusivamente de consulta.
- No expone controles de edición.
- Muestra datos generales, institución, seguridad y privilegios administrativos.
- Conserva el mismo header y layout de Accesos disponibles.
- Es responsive y reutiliza componentes atómicos del módulo `features/profile`.
