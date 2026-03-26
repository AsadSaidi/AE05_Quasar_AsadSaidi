<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Películas App </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menú </q-item-label>

        <q-item clickable @click="go('/movies')" v-if="auth.loggedIn">
          <q-item-section avatar>
            <q-icon name="movie" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Películas</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="go('/login')" v-if="!auth.loggedIn">
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Login</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="go('/register')" v-if="!auth.loggedIn">
          <q-item-section avatar>
            <q-icon name="app_registration" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Registro</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-if="auth.loggedIn" @click="doLogout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuth } from "stores/auth";

const router = useRouter();
const auth = useAuth();
const $q = useQuasar();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function go(path) {
  leftDrawerOpen.value = false;
  router.push(path);
}

async function doLogout() {
  try {
    await auth.logout();
  } catch (e) {
    $q.notify({
      message: e?.message || "Error al cerrar sesión",
      color: "negative",
    });
  }
  leftDrawerOpen.value = false;
  router.push("/login");
}

onMounted(async () => {
  await auth.checkSessionOnce();
});
</script>
