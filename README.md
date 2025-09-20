# Conviven Frontend

Esta aplicación React + TypeScript implementa la primera iteración del flujo de autenticación contra el backend de Conviven.

## Requisitos previos

- Node.js 20 o superior
- npm 10

## Configuración

1. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto con la URL base del backend:

   ```bash
   VITE_API_BASE_URL=http://localhost:4000
   ```

   El cliente HTTP compone automáticamente las rutas usando `VITE_API_BASE_URL + '/api'`.

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   La aplicación queda disponible en `http://localhost:5173`.

## Pruebas

Ejecuta los tests unitarios (compilan los archivos necesarios a `.tests-dist` y utilizan el runner nativo de Node):

```bash
npm test
```

## Endpoints utilizados

El frontend consume los siguientes endpoints del backend Conviven:

- `POST /auth/login` — autentica al usuario y devuelve `{ accessToken, refreshToken }`.
- `POST /auth/refresh` — renueva los tokens usando `{ refreshToken }`.
- `GET /users/me` — obtiene el usuario asociado al `accessToken` activo.
- `GET /health` — comprobación manual opcional del estado del backend (sin prefijo `/api`).

## Estructura relevante

- `src/config/httpClient.ts`: cliente HTTP con soporte para refresh automático y expulsión de sesión.
- `src/services/authService.ts`: login, refresh, almacenamiento de tokens en memoria y `localStorage`.
- `src/store/AuthStore.tsx`: contexto React que expone `useAuth()` para acceder al estado de autenticación.
- `src/pages/LoginPage.tsx` / `src/pages/DashboardPage.tsx`: páginas principales de la iteración.
- `docs/integration-notes.md`: notas sobre el flujo implementado y tareas pendientes.
