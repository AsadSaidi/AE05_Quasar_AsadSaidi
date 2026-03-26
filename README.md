# Quasar App (ae05-quasar)

A Quasar Project

## Levantar el proyecto completo (Front + Backend)

Este front consume un backend en la URL configurada por `VITE_API_BASE_URL` (por defecto: `http://localhost:3000`).
Debes tener el backend ejecutándose para que las rutas como `/api/movies` funcionen.
Lo ideal es abrir 2 terminales: uno para el backend y otro para este front.

### 1) Levantar el backend

Por defecto, el front llama a:

```text
http://localhost:3000
```

Donde espera endpoints tipo:
- `GET /api/movies`
- `POST /api/movies`
- `PUT /api/movies/:id`
- `DELETE /api/movies/:id`
- `GET /api/_auth/session`
- `POST /auth/login`
- `POST /auth/register`

Inicia tu backend (el repo/carpeta del backend) en el puerto `3000`. El comando exacto depende del backend que estés usando (por ejemplo, `npm run dev` / `nuxi dev` / `node ...`).

Si tu backend corre en otra URL/puerto, crea un archivo `.env` en la raíz del front y configura:

```bash
VITE_API_BASE_URL=http://TU-HOST:TU-PUERTO
```

Para levantar el front, sigue las instrucciones de abajo.

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
