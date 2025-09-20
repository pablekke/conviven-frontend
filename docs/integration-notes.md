# Notas de integración Conviven

## Flujo de autenticación

1. El formulario de `LoginPage` recoge email y contraseña y delega en `authService.login`.
2. `authService` realiza el `POST /auth/login`, persiste los tokens en memoria y `localStorage` y notifica a los suscriptores de cambios.
3. `AuthStore` (Context) escucha los cambios de tokens mediante `AuthStateManager` y solicita `GET /users/me` para completar la sesión.
4. Las rutas protegidas (`ProtectedRoute`) muestran un loader mientras el estado es `authenticating` y redirigen a `/login` si no existe sesión válida.
5. El `DashboardPage` renderiza la información básica del usuario autenticado y expone el botón de cierre de sesión.

## Refresh automático de tokens

- El cliente HTTP (`httpClient.ts`) adjunta `Authorization: Bearer <accessToken>` en todas las peticiones.
- Ante una respuesta 401 intenta refrescar los tokens una sola vez llamando a `authService.refresh` (`POST /auth/refresh`).
- Si el refresh es exitoso, repite la petición original con los nuevos tokens.
- Si el refresh falla o no hay `refreshToken`, se limpia la sesión, se eliminan los tokens persistidos y se emite el evento `auth:session-expired` para que la UI redirija al login.

## Limitaciones y pendientes

- Falta manejar colas de refresco concurrente para evitar múltiples llamadas simultáneas al endpoint `/auth/refresh` en escenarios de alta concurrencia.
- No se implementó UI específica para mostrar estados de sesión expirada; actualmente se muestra un mensaje genérico en el `LoginPage` tras redirigir.
- Los tests cubren el flujo de login/logout y la persistencia de tokens, pero no existen pruebas end-to-end ni mocks de red más complejos.
- El manejo de errores del backend se limita al campo `message`; sería conveniente modelar códigos de error específicos cuando el backend los provea.
