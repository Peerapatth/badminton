<template>
  <div
    class="flex justify-center items-center p-6 w-full min-h-screen bg-gradient-to-br from-blue-100 to-blue-300"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full border border-blue-200"
    >
      <img
        src="https://ui-avatars.com/api/?name={{ user.name || 'User' }}&background=1e40af&color=fff&size=128"
        alt="Avatar"
        class="mx-auto mb-4 rounded-full shadow-lg border-4 border-blue-200"
        width="96"
        height="96"
      />
      <h2 class="text-2xl font-extrabold mb-2 text-blue-700">Profile</h2>
      <div v-if="user">
        <div class="mb-4">
          <p class="text-lg font-semibold text-gray-700">
            <span class="text-blue-600">Name:</span> {{ user.name }}
          </p>
          <p class="text-lg font-semibold text-gray-700">
            <span class="text-blue-600">Username:</span> {{ user.username }}
          </p>
          <p class="text-lg font-semibold text-gray-700">
            <span class="text-blue-600">Level:</span>
            <span
              class="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 font-bold"
            >
              {{ user.level }}
            </span>
          </p>
        </div>
      </div>
      <div v-else>
        <p class="text-gray-500">No user data found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const user = authStore.userData;
</script>