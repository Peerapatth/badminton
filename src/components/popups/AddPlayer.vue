<template>
  <teleport to="body">
    <div
      class="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-6"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs relative">
        <div class="flex flex-col mb-4">
          <div class="flex justify-between items-center gap-4">
            <h3 class="text-base font-semibold">Add Player</h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-700 text-xl"
              aria-label="Close"
            >
              <Close class="w-3 h-3 cursor-pointer" />
            </button>
          </div>
          <div class="text-sm text-gray-500">
            <span>Add player details.</span>
          </div>
        </div>
        <form @submit.prevent="submitPlayer" class="flex flex-col gap-2">
          <label for="name" class="text-xs text-gray-500">Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Name"
            class="p-2 border border-gray-200 rounded text-sm"
            required
          />
          <label for="gender" class="text-xs text-gray-500">Gender</label>
          <div class="p-2 border border-gray-200 rounded">
            <select
              v-model="form.gender"
              class="rounded w-full outline-none cursor-pointer text-sm"
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <label for="level" class="text-xs text-gray-500">Level</label>
          <div class="p-2 border border-gray-200 rounded">
            <select
              v-model="form.level"
              class="rounded w-full outline-none cursor-pointer text-sm"
              required
            >
              <option value="" disabled>Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div class="w-full h-[1px] bg-gray-200 my-1"></div>
          <button
            type="submit"
            class="bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-base font-semibold cursor-pointer"
          >
            Add Player
          </button>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import Close from "@/assets/elements/Close.vue";
const props = defineProps({
  playerForm: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["add-player", "close"]);

const form = ref({ ...props.playerForm });

watch(
  () => props.playerForm,
  (val) => {
    form.value = { ...val };
  }
);

function submitPlayer() {
  emit("add-player", { ...form.value });
  emit("close");
}
</script>

<style lang="scss" scoped></style>
