<template>
  <q-page class="row items-center justify-center q-pa-md">
    <q-card style="width: 100%; max-width: 420px">
      <q-card-section>
        <div class="text-h6">Registro</div>
        <div class="text-subtitle2">Crea tu cuenta para empezar</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <q-input
            v-model="name"
            label="Nombre"
            filled
            lazy-rules
            :disable="loading"
          />

          <q-input
            v-model="email"
            label="Email"
            type="email"
            filled
            class="q-mt-md"
            lazy-rules
            :disable="loading"
          />

          <q-input
            v-model="password"
            label="Password"
            type="password"
            filled
            class="q-mt-md"
            lazy-rules
            :disable="loading"
          />

          <div class="row q-gutter-sm q-mt-md">
            <q-btn
              color="primary"
              type="submit"
              label="Crear cuenta"
              :loading="loading"
            />
            <q-btn
              flat
              color="primary"
              label="Ya tengo cuenta"
              :disable="loading"
              @click="router.push('/login')"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useAuth } from "stores/auth";

const router = useRouter();
const auth = useAuth();
const $q = useQuasar();

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);

async function onSubmit() {
  loading.value = true;
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    $q.notify({ message: "Registro correcto", color: "positive" });
    router.push("/movies");
  } catch (e) {
    $q.notify({
      message: e?.message || "Error al registrar",
      color: "negative",
    });
  } finally {
    loading.value = false;
  }
}
</script>

