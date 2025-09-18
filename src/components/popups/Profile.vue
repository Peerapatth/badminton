<template>
  <teleport to="body">
    <div
      class="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-6"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs relative">
        <div class="flex justify-between items-center gap-4 mb-4">
          <h3></h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-700 text-xl"
            aria-label="Close"
          >
            <Close class="w-3 h-3 cursor-pointer" />
          </button>
        </div>
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-4">Profile</h3>
          <img
            :src="'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=1e40af&color=fff&size=128'"
            alt="Avatar"
            class="mx-auto mb-4 rounded-full shadow-lg border-4 border-gray-200"
            width="96"
            height="96"
          />
          <div v-if="user">
            <div class="mb-4">
              <p class="text-base font-medium">
                Name :
                <span class="font-normal">{{ user.name }}</span>
              </p>
              <p class="text-base font-medium">
                Username :
                <span class="font-normal">{{ user.username }}</span>
              </p>
            </div>
            <div class="w-full h-[1px] bg-gray-200 my-1"></div>
            <button
              @click="handleLogout"
              class="w-full mt-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-base font-semibold cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors duration-200"
          >
              Logout
            </button>
          </div>
          <div v-else>
            <p class="text-gray-500">No user data found.</p>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import Close from "@/assets/elements/Close.vue";
const authStore = useAuthStore();
const user = authStore.userData;
const emit = defineEmits(["close"]);

function handleLogout() {
  authStore.logout();
  emit("close");
  window.location.reload(); 
}
</script>