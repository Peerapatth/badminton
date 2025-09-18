<template>
  <teleport to="body">
    <div class="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-6">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs relative">
        <div class="flex flex-col mb-4">
          <div class="flex justify-between items-center gap-4">
            <h3 class="text-base font-semibold">Select Date</h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-700 text-xl"
              aria-label="Close"
            >
              <Close class="w-3 h-3 cursor-pointer" />
            </button>
          </div>
          <div class="text-sm text-gray-500">
            <span>Pick a date to view players.</span>
          </div>
        </div>
        <form @submit.prevent="submitDate" class="flex flex-col gap-2 w-full">
          <v-calendar
            :attributes="calendarAttrs"
            @dayclick="onDayClick"
            is-expanded
            class="w-full"
          />
          <div class="w-full h-[1px] bg-gray-200 my-1"></div>
          <button
            type="submit"
            class="bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-base font-semibold cursor-pointer"
            :disabled="!selectedDate"
          >
            Select Date
          </button>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from "vue";
import Close from "@/assets/elements/Close.vue";
const emit = defineEmits(["select-date", "close"]);

const selectedDate = ref("");

const today = new Date().toISOString().split("T")[0];

function onDayClick(day) {
  selectedDate.value = day.date;
}

const calendarAttrs = computed(() => {
  const attrs = [];
  if (selectedDate.value) {
    attrs.push({ key: "selected", highlight: true, dates: selectedDate.value });
  }
  attrs.push({
    key: "today",
    highlight: {
      color: "blue",
      fillMode: "light",
    },
    dates: today,
  });
  return attrs;
});

function submitDate() {
  emit("select-date", selectedDate.value);
  emit("close");
}
</script>

<style lang="scss" scoped></style>