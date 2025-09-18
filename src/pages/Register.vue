<template>
  <div class="flex justify-center items-center min-h-screen">
    <form
      @submit.prevent="register"
      class="bg-white p-8 rounded shadow max-w-xs w-full"
    >
      <h2 class="text-xl font-bold mb-4 text-blue-600">Register</h2>
      <input
        v-model="name"
        type="text"
        placeholder="Name"
        class="mb-3 w-full p-2 border rounded"
        required
      />
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
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="mb-3 w-full p-2 border rounded"
        required
      />
      <select
        v-model="level"
        class="mb-3 w-full p-2 border rounded"
        required
      >
        <option value="" disabled>Select Level</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded font-semibold"
        :disabled="loading"
      >
        <span v-if="loading">Registering...</span>
        <span v-else>Register</span>
      </button>
      <button
        type="button"
        class="w-full bg-gray-200 text-blue-600 py-2 rounded font-semibold mt-2"
        @click="goToLogin"
      >
        Login
      </button>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      <p v-if="success" class="text-green-500 mt-2">{{ success }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

const router = useRouter();
const name = ref("");
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const level = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);

const register = async () => {
  error.value = "";
  success.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  loading.value = true;
  try {
    await addDoc(collection(db, "users"), {
      name: name.value,
      username: username.value,
      password: password.value, 
      level: level.value,
      createdAt: new Date(),
    });
    success.value = "Registration successful!";
    name.value = "";
    username.value = "";
    password.value = "";
    confirmPassword.value = "";
    level.value = "";
    setTimeout(() => {
      router.push("/login");
    }, 1000); 
  } catch (e) {
    error.value = "Registration failed";
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style lang="scss" scoped>
</style>