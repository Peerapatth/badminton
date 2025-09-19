<template>
  <div class="flex flex-col gap-6">
    <h2 class="text-lg font-bold mb-4">Badminton Courts</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div
        v-for="(court, idx) in courts"
        :key="court.id"
        class="bg-white border rounded-xl shadow p-4 overflow-auto"
      >
        <h3 class="text-base font-semibold mb-2">Court {{ idx + 1 }}</h3>
        <div class="flex flex-col gap-2">
          <div v-for="(team, tIdx) in [0,1]" :key="tIdx" class="flex gap-2 mb-2">
            <div v-for="(player, pIdx) in court.teams[team]" :key="pIdx" class="flex items-center gap-2">
              <select
                v-model="court.teams[team][pIdx]"
                class="border rounded px-2 py-1 text-sm"
              >
                <option value="">Select Player</option>
                <option
                  v-for="p in activePlayers"
                  :key="p.id"
                  :value="p.id"
                  :disabled="isPlayerAssigned(p.id)"
                >
                  {{ p.name }}
                </option>
              </select>
              <select
                v-model="court.playerStatus[court.teams[team][pIdx]]"
                class="border rounded px-2 py-1 text-xs"
                :disabled="!court.teams[team][pIdx]"
              >
                <option value="">Status</option>
                <option value="win">Win</option>
                <option value="lose">Lose</option>
              </select>
            </div>
          </div>
          <div class="mt-2">
            <button
              class="bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm font-semibold"
              @click="resetCourt(idx)"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  activePlayers: {
    type: Array,
    required: true,
  },
});

const courts = ref([
  {
    id: 1,
    teams: [["", ""], ["", ""]],
    playerStatus: {},
  },
  { id: 2, teams: [["", ""], ["", ""]], playerStatus: {} },
  { id: 3, teams: [["", ""], ["", ""]], playerStatus: {} },
  { id: 4, teams: [["", ""], ["", ""]], playerStatus: {} },
]);

function isPlayerAssigned(playerId) {
  return courts.value.some(court =>
    court.teams.flat().includes(playerId)
  );
}

function resetCourt(idx) {
  courts.value[idx].teams = [["", ""], ["", ""]];
  courts.value[idx].playerStatus = {};
}
</script>

<style lang="scss" scoped></style>