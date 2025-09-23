<template>
  <teleport to="body">
    <div
      class="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-6"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs relative">
        <div class="flex flex-col mb-4">
          <div class="flex justify-between items-center gap-4">
            <h3 class="text-lg font-semibold">Register</h3>
          </div>
          <div class="text-sm text-gray-500">
            <span>Fill in your details to register.</span>
          </div>
        </div>
        <form @submit.prevent="register" class="flex flex-col gap-2">
          <label for="name" class="text-xs text-gray-500">Name</label>
          <input
            v-model="name"
            type="text"
            placeholder="Name"
            class="p-2 border border-gray-200 rounded  text-sm"
            required
          />
          <label for="username" class="text-xs text-gray-500">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            class="p-2 border border-gray-200 rounded text-base"
            required
          />
          <label for="password" class="text-xs text-gray-500">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="p-2 border border-gray-200 rounded text-base"
            required
          />
          <label for="confirmPassword" class="text-xs text-gray-500">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="p-2 border border-gray-200 rounded text-base"
            required
          />
          <div class="w-full h-[1px] bg-gray-200 my-1"></div>
          <button
            type="submit"
            class="bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-base font-semibold cursor-pointer"
            :disabled="loading"
          >
            <span v-if="loading">Registering...</span>
            <span v-else>Register</span>
          </button>
          <button
            type="button"
            class="w-full text-[14px] font-semibold transition-colors duration-200"
          >
            <span class="text-sm font-normal text-gray-500"
              >Already have an account?
            </span>
            <span @click="goToLogin" class="font-medium cursor-pointer"
              >Login</span
            >
          </button>
          <p v-if="error" class="text-red-500 mt-2 w-full text-center">{{ error }}</p>
          <p v-if="success" class="text-green-500 mt-2 w-full text-center">{{ success }}</p>
        </form>
      </div>
    </div>
  </teleport>
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
      createdAt: new Date(),
    });
    success.value = "Registration successful!";
    name.value = "";
    username.value = "";
    password.value = "";
    confirmPassword.value = "";
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

<style lang="scss" scoped></style>
