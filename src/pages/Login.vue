<template>
  <teleport to="body">
    <div
      class="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-6"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs relative">
        <div class="flex flex-col mb-4">
          <div class="flex justify-between items-center gap-4">
            <h3 class="text-lg font-semibold">Login</h3>
          </div>
          <div class="text-sm text-gray-500">
            <span>Enter your credentials.</span>
          </div>
        </div>
        <form @submit.prevent="login" class="flex flex-col gap-2">
          <label for="username" class="text-xs text-gray-500">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            class="p-2 border border-gray-200 rounded text-sm"
            required
          />
          <label for="password" class="text-xs text-gray-500">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="p-2 border border-gray-200 rounded text-sm"
            required
          />
          <div class="w-full h-[1px] bg-gray-200 my-1"></div>

          <button
            type="submit"
            class="bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-base font-semibold cursor-pointer"
            :disabled="loading"
          >
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
          </button>
          <button
            type="button"
            class="w-full text-[14px] font-semibold transition-colors duration-200"
          >
            <span class="text-sm font-normal text-gray-500"
              >Don't have an account?
            </span>
            <span @click="goToRegister" class="font-medium cursor-pointer"
              >Register</span
            >
          </button>
          <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthStore } from "@/stores/auth";
import Close from "@/assets/elements/Close.vue";

const router = useRouter();
const authStore = useAuthStore();
const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const login = async () => {
  error.value = "";
  loading.value = true;
  try {
    const q = query(
      collection(db, "users"),
      where("username", "==", username.value)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      error.value = "User not found";
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password.value) {
      error.value = "Incorrect password";
      return;
    }

    authStore.logged_in = true;
    authStore.setUserData({
      id: userDoc.id,
      username: userData.username,
      name: userData.name,
      level: userData.level || "",
    });
    authStore.setAccessToken(userDoc.id);
    router.push("/");
  } catch (e) {
    error.value = "Login failed";
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push("/register");
};

const goHome = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped></style>
