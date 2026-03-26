<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5">Películas</div>
        <div class="text-subtitle2" v-if="auth.loggedIn">
          CRUD conectado a tu API Nuxt
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Nueva película"
        :disable="!auth.loggedIn"
        @click="openCreate"
      />
    </div>

    <q-card v-if="loading" flat bordered class="q-pa-md">
      <q-spinner />
      <div class="text-subtitle2 q-mt-sm">Cargando...</div>
    </q-card>

    <q-banner
      v-else-if="auth.ready && !auth.loggedIn"
      dense
      class="bg-grey-3 text-dark q-mb-md"
      rounded
      inline-actions
    >
      Necesitas iniciar sesión.
      <template #action>
        <q-btn color="primary" size="sm" label="Ir a login" @click="goLogin" />
      </template>
    </q-banner>

    <q-list
      v-else-if="movies.length"
      bordered
      separator
      class="rounded-borders"
    >
      <q-item v-for="m in movies" :key="m.id">
        <q-item-section avatar>
          <div
            style="
              width: 56px;
              height: 56px;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              border-radius: 0;
            "
          >
            <q-img
              v-if="m.portada"
              :src="m.portada"
              spinner-color="primary"
              style="width: 100%; height: 100%; border-radius: 0; object-fit: cover"
            />
            <q-icon v-else name="image_not_supported" />
          </div>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-medium">
            {{ m.nombre }}
          </q-item-label>
          <q-item-label caption>
            {{ m.genero }} - {{ m.director }} ({{ m.year }})
          </q-item-label>
        </q-item-section>

        <q-item-section side top class="row items-start q-gutter-xs">
          <q-btn
            dense
            flat
            round
            icon="edit"
            color="primary"
            aria-label="Editar"
            @click="openEdit(m)"
          />
          <q-btn
            dense
            flat
            round
            icon="delete"
            color="negative"
            aria-label="Eliminar"
            @click="confirmDelete(m)"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-card v-else-if="!loading && auth.loggedIn" flat bordered class="q-pa-md">
      <div class="text-subtitle2">No tienes películas todavía.</div>
      <div class="text-caption q-mt-sm">
        Usa “Nueva película” para crear tu primer registro.
      </div>
    </q-card>

    <!-- Dialog create/edit -->
    <q-dialog v-model="formDialogOpen" persistent>
      <q-card style="width: 100%; max-width: 720px">
        <q-card-section>
          <div class="text-h6">
            {{ mode === "create" ? "Crear película" : "Editar película" }}
          </div>
          <div class="text-subtitle2">
            {{ mode === "create" ? "Nuevo registro" : `ID: ${currentId}` }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-form @submit.prevent="saveMovie">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.nombre"
                  label="Nombre"
                  filled
                  :disable="saving"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="form.year"
                  label="Año"
                  type="number"
                  filled
                  :disable="saving"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  v-model.number="form.presupuesto"
                  label="Presupuesto"
                  type="number"
                  filled
                  :disable="saving"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.genero"
                  label="Género"
                  filled
                  :disable="saving"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.director"
                  label="Director"
                  filled
                  :disable="saving"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.productora"
                  label="Productora"
                  filled
                  :disable="saving"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.portada"
                  label="Portada (URL opcional)"
                  filled
                  :disable="saving"
                />
              </div>
            </div>

            <q-card-actions align="right" class="q-mt-md">
              <q-btn flat label="Cancelar" :disable="saving" v-close-popup />
              <q-btn
                color="primary"
                type="submit"
                label="Guardar"
                :loading="saving"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog delete -->
    <q-dialog v-model="deleteDialogOpen" persistent>
      <q-card style="width: 100%; max-width: 520px">
        <q-card-section>
          <div class="text-h6">Confirmar eliminación</div>
          <div class="text-subtitle2">
            ¿Seguro que quieres borrar esta película?
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-caption">
            ID: {{ deleteId }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" :disable="saving" v-close-popup />
          <q-btn
            color="negative"
            label="Eliminar"
            :loading="saving"
            @click="deleteMovie"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { apiFetch } from "src/utils/api";
import { useAuth } from "stores/auth";

const router = useRouter();
const auth = useAuth();
const $q = useQuasar();

const movies = ref([]);
const loading = ref(false);

const formDialogOpen = ref(false);
const deleteDialogOpen = ref(false);

const mode = ref("create");
const currentId = ref(null);
const deleteId = ref(null);
const saving = ref(false);

const form = reactive({
  nombre: "",
  year: 2000,
  genero: "",
  director: "",
  presupuesto: 0,
  productora: "",
  portada: "",
});

function resetForm() {
  form.nombre = "";
  form.year = 2000;
  form.genero = "";
  form.director = "";
  form.presupuesto = 0;
  form.productora = "";
  form.portada = "";
}

function fillFormFromMovie(m) {
  form.nombre = m.nombre ?? "";
  form.year = Number(m.year ?? 0);
  form.genero = m.genero ?? "";
  form.director = m.director ?? "";
  form.presupuesto = Number(m.presupuesto ?? 0);
  form.productora = m.productora ?? "";
  form.portada = m.portada ?? "";
}

function openCreate() {
  mode.value = "create";
  currentId.value = null;
  resetForm();
  formDialogOpen.value = true;
}

function openEdit(m) {
  mode.value = "edit";
  currentId.value = m.id;
  fillFormFromMovie(m);
  formDialogOpen.value = true;
}

function confirmDelete(m) {
  deleteId.value = m.id;
  deleteDialogOpen.value = true;
}

function goLogin() {
  router.push("/login");
}

async function loadMovies() {
  loading.value = true;
  try {
    movies.value = await apiFetch("/api/movies");
  } catch (e) {
    if (e?.status === 401) {
      auth.state.loggedIn = false;
      auth.state.user = null;
      router.push("/login");
      return;
    }
    $q.notify({
      message: e?.message || "Error cargando películas",
      color: "negative",
    });
  } finally {
    loading.value = false;
  }
}

async function saveMovie() {
  saving.value = true;
  try {
    const payload = {
      nombre: form.nombre,
      year: Number(form.year),
      genero: form.genero,
      director: form.director,
      presupuesto: Number(form.presupuesto),
      productora: form.productora,
      portada: form.portada || "",
    };

    if (mode.value === "create") {
      await apiFetch("/api/movies", { method: "POST", body: payload });
      $q.notify({ message: "Se guardó la película", color: "positive" });
    } else {
      await apiFetch(`/api/movies/${currentId.value}`, {
        method: "PUT",
        body: payload,
      });
      $q.notify({
        message: "Se actualizó la película",
        color: "positive",
      });
    }

    formDialogOpen.value = false;
    await loadMovies();
  } catch (e) {
    $q.notify({
      message: e?.message || "Error guardando la película",
      color: "negative",
    });
  } finally {
    saving.value = false;
  }
}

async function deleteMovie() {
  if (!deleteId.value) return;
  saving.value = true;
  try {
    await apiFetch(`/api/movies/${deleteId.value}`, { method: "DELETE" });
    $q.notify({ message: "Película eliminada", color: "positive" });
    deleteDialogOpen.value = false;
    await loadMovies();
  } catch (e) {
    $q.notify({
      message: e?.message || "Error eliminando la película",
      color: "negative",
    });
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await auth.checkSessionOnce();
  if (auth.loggedIn) await loadMovies();
});

watch(
  () => auth.ready,
  async (ready) => {
    if (ready && auth.loggedIn) await loadMovies();
  }
);

watch(
  () => auth.loggedIn,
  async (loggedIn) => {
    if (loggedIn) await loadMovies();
  }
);
</script>

