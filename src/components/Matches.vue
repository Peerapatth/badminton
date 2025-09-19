<template>
  <div
    class="w-full flex flex-col gap-6 p-6 sm:p-8 rounded-xl bg-white border border-gray-200 "
  >
    <h2 class="text-base font-medium">Matches History</h2>
    <div class="w-full h-[1px] bg-gray-200 -mt-4"></div>
    <ul>
      <li
        v-for="match in matches"
        :key="match.id"
        class="flex flex-col gap-2 mb-4 p-4  rounded-lg border border-gray-200 "
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          <div class="flex w-full items-center justify-between gap-4 mt-1">
            <span class="flex-1 text-right font-medium text-gray-700">
              {{ match.teams[0].players.map(pid => playerNames[pid] || pid).join(" & ") }}
            </span>
            <span class="mx-2 text-gray-400 font-bold">vs</span>
            <span class="flex-1 text-left font-medium text-gray-700">
              {{ match.teams[1].players.map(pid => playerNames[pid] || pid).join(" & ") }}
            </span>
          </div>
        </div>
        <div class="flex gap-2 justify-center mt-2">
          <span
            class="px-2 py-1 rounded text-xs font-semibold"
            :class="match.teams[0].result === 'win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
          >
            {{ match.teams[0].result === "win" ? "Win" : "Lose" }}
          </span>
          <span
            class="px-2 py-1 rounded text-xs font-semibold"
            :class="match.teams[1].result === 'win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
          >
            {{ match.teams[1].result === "win" ? "Win" : "Lose" }}
          </span>
        </div>
      </li>
    </ul>
    <div v-if="matches.length === 0" class="text-gray-500 text-sm w-full text-center">
      No matches found.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

const matches = ref([]);
const playerNames = ref({});

onMounted(async () => {
  const matchesSnapshot = await getDocs(collection(db, "matches"));
  matches.value = matchesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const playersSnapshot = await getDocs(collection(db, "players"));
  playersSnapshot.forEach((doc) => {
    playerNames.value[doc.id] = doc.data().name;
  });
});
</script>

<style lang="scss" scoped>

</style>