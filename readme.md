# Proyecto de Películas

Este proyecto es un proyecto simple para el curso IFCD0210.

El proyecto es una aplicación CRUD simple para gestionar películas.

## Configuración inicial

A partir de un proyecto anterior, se incluye la instalación/configuración de:

- `prettier`
- `eslint` / `typescript-eslint`
- `typescript`
- `vitest`
- `cross-env`
- `debug`
- `zod`
- `express`
  - `cors`
  - `body-parser`

Igualmente instalados `prisma` y `@prisma/client`

La estructura inicial, tomada de dicho proyecto incluye en src:

- `index.ts`
- `app.ts`
- `server/error-manager.ts`
- `server/listen-manager.ts`
- `middleware/debug-logger.ts`
- `errors/http-error.ts`
- `controllers/base.controller.ts`
- `controllers/errors.controller.ts`
