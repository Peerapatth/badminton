<template>
  <div class="flex justify-center items-center min-h-screen">
    <form
      @submit.prevent="register"
      class="bg-white p-8 rounded shadow max-w-xs w-full"
    >
      <h2 class="text-xl font-bold mb-4 text-blue-600">Register</h2>
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
        class="w-full bg-blue-600 text-white py-2 rounded font-semibold"
        :disabled="loading"
      >
        <span v-if="loading">Registering...</span>
        <span v-else>Register</span>
      </button>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      <p v-if="success" class="text-green-500 mt-2">{{ success }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

const username = ref("");
const password = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);

const register = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;
  try {
    await addDoc(collection(db, "users"), {
      username: username.value,
      password: password.value,
      createdAt: new Date(),
    });
    success.value = "Registration successful!";
    username.value = "";
    password.value = "";
  } catch (e) {
    error.value = "Registration failed";
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
</style>