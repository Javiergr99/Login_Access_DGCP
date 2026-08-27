# Calidad, seguridad y validación

Baseline validado localmente el **26 de agosto de 2026**.

## Resultado

| Validación                | Resultado                                                |
| ------------------------- | -------------------------------------------------------- |
| Encoding                  | ✅ 175 archivos UTF-8 sin BOM ni mojibake                |
| Prettier                  | ✅                                                       |
| Estructura                | ✅ 139 archivos TypeScript / 0 imports locales faltantes |
| TypeScript                | ✅                                                       |
| Vitest                    | **12 archivos / 29 tests**                               |
| Build Vite                | ✅                                                       |
| React Doctor              | ⚠️ **1 hallazgo: Auth token in Web Storage**             |
| Code splitting            | ✅                                                       |
| Mayor chunk observado     | **341.99 kB / 108.15 kB gzip**                           |
| Warning de chunks >500 kB | eliminado                                                |
| Playwright E2E mock       | **1 passed**                                             |
| Playwright E2E real       | **pendiente tras actualización Backend**                 |

## E2E real — pendiente de revalidación

El E2E mock vigente pasa correctamente. La prueba E2E real deberá revalidarse
cuando `auth_service` implemente la sesión mediante refresh cookie HttpOnly.

La revalidación real deberá cubrir:

1. disponibilidad de `auth_service`;
2. login real;
3. desafío MFA sin persistencia del `temp_token`;
4. TOTP real;
5. refresh cookie `HttpOnly`;
6. ausencia de JWT en Web Storage;
7. acceso autorizado;
8. `redirect-code`;
9. `exchange-code`;
10. entrada en Mesa de Ayuda;
11. F5 y restauración de sesión;
12. logout;
13. eliminación de cookie y revocación cross-app.

## Validación mínima

```powershell
npm run typecheck
npm run test
npm run build
npx -y react-doctor@latest . --scope full --score --yes
```

Para autenticación/SSO:

```powershell
npm run test:e2e:real
```

Las credenciales y el secreto TOTP de la cuenta de pruebas se suministran como
variables de entorno locales y nunca se versionan.

Los reportes de Playwright/React Doctor son artefactos temporales.
