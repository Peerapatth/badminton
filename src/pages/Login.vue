<template>
  <div class="flex justify-center items-center min-h-screen">
    <form
      @submit.prevent="login"
      class="bg-white p-8 rounded shadow max-w-xs w-full"
    >
      <h2 class="text-xl font-bold mb-4 text-blue-600">Login</h2>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
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
      >
        Login
      </button>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  error.value = "";
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });
    const result = await response.json();
    if (response.ok) {
      window.location.href = "/";
    } else {
      error.value = result.message || "Login failed";
    }
  } catch (e) {
    error.value = "Network error";
  }
};
</script>
