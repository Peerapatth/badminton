<template>
  <div class="flex justify-center items-center min-h-screen">
    <form
      @submit.prevent="login"
      class="bg-white p-8 rounded shadow max-w-xs w-full"
    >
      <h2 class="text-xl font-bold mb-4 text-blue-600">Login</h2>
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="mb-3 w-full p-2 border rounded"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="mb-3 w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded font-semibold mb-2"
        :disabled="loading"
      >
        <span v-if="loading">Logging in...</span>
        <span v-else>Login</span>
      </button>
      <button
        type="button"
        class="w-full bg-gray-200 text-blue-600 py-2 rounded font-semibold"
        @click="goToRegister"
      >
        Register
      </button>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthStore } from "@/stores/auth";

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
</script>
