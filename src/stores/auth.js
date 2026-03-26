import { reactive } from "vue";
import { apiFetch } from "src/utils/api";

// Estado global simple (sin Pinia) para login/registro.
const state = reactive({
  ready: false,
  loggedIn: false,
  user: null,
});

let sessionCheckPromise = null;

async function checkSession() {
  const data = await apiFetch("/api/_auth/session", { method: "GET" });
  // nuxt-auth-utils devuelve la data de la sesión (p.ej. { user: {...} }).
  const nextUser = data?.user ?? data ?? null;
  state.loggedIn = !!nextUser;
  state.user = nextUser;
}

async function checkSessionOnce() {
  if (state.ready) return;
  if (sessionCheckPromise) return sessionCheckPromise;
  sessionCheckPromise = checkSession()
    .catch(() => {
      // Si ya teníamos usuario (por login/register reciente), no sobreescribimos
      // el estado con un fallo temporal del endpoint de sesión.
      if (!state.user) {
        state.loggedIn = false;
        state.user = null;
      }
    })
    .finally(() => {
      state.ready = true;
      sessionCheckPromise = null;
    });
  return sessionCheckPromise;
}

export function useAuth() {
  async function login({ email, password }) {
    const resp = await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    const nextUser = resp?.user ?? resp ?? null;
    state.loggedIn = !!nextUser;
    state.user = nextUser;
  }

  async function register({ name, email, password }) {
    const resp = await apiFetch("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    const nextUser = resp?.user ?? resp ?? null;
    state.loggedIn = !!nextUser;
    state.user = nextUser;
  }

  async function logout() {
    await apiFetch("/api/_auth/session", { method: "DELETE" });
    state.loggedIn = false;
    state.user = null;
    state.ready = true;
  }

  return {
    state,
    get loggedIn() {
      return state.loggedIn;
    },
    get user() {
      return state.user;
    },
    get ready() {
      return state.ready;
    },
    checkSessionOnce,
    login,
    register,
    logout,
  };
}

