// Base URL de tu backend Nuxt.
// En Android Emulator (ruta clásica) "localhost" apunta al teléfono, no al PC,
// por eso usamos 10.0.2.2.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  // En emulador Android (Capacitor) el PC no es "localhost" desde el móvil.
  // En navegador normal usamos localhost para pruebas.
  (typeof window !== "undefined" && window.Capacitor
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000");

