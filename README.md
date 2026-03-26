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

### 2) Levantar el front (este repo)

#### Install the dependencies

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

### 3) Compilar Android (Capacitor) y generar APK

1. Genera el build web del front (si no lo has hecho):

   ```bash
   quasar build
   ```

2. Sincroniza el proyecto de Capacitor Android:

   ```bash
   cd src-capacitor
   npx cap sync android
   ```

3. Abre Android Studio (opcional) o compila el APK:

   ```bash
   npx cap open android
   ```

   Para generar el `.apk` desde consola:

   ```bash
   cd android
   gradlew.bat assembleDebug
   ```

El `.apk` suele quedar en:

`src-capacitor/android/app/build/outputs/apk/debug/app-debug.apk`

### 4) Mostrar la app en Android Studio (otro PC)

Tienes 2 opciones:

1. **Transferir el APK y instalarlo**
   - Copia el archivo `.apk` al otro PC.
   - En el otro PC, abre Android Studio y levanta un emulador (o conecta un móvil por USB).
   - Instálalo (recomendado por consola con `adb`):
     ```powershell
     adb devices
     adb install -r "ruta\al\app-debug.apk"
     ```
   - Si te es más cómodo, también puedes arrastrar el `.apk` dentro de Android Studio o instalarlo desde el emulador (depende de la versión).

2. **Abrir el proyecto Android en Android Studio**
   - En el PC “donde compilas”, asegúrate de haber ejecutado `npx cap sync android`.
   - Copia la carpeta `src-capacitor/android` al otro PC.
   - En Android Studio: `File > Open` y selecciona esa carpeta (`src-capacitor/android`).
   - Luego usa `Run` para instalar en el emulador/dispositivo.

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
