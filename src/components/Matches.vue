<template>
  <div
    class="w-full flex flex-col gap-6 p-6 sm:p-8 rounded-xl bg-white border border-gray-200"
  >
    <h2 class="text-base font-medium">Matches History</h2>
    <div class="w-full h-[1px] bg-gray-200 -mt-4"></div>
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <li
        v-for="match in sortedMatches.slice(0, showCount)"
        :key="match.id"
        class="flex flex-col gap-2 mb-4 p-4 rounded-lg border border-gray-200"
      >
        <div class="flex justify-center -mb-3">
          <div class="rounded text-xs text-gray-500">
            <span v-if="match.finished_at">
              {{
                new Date(match.finished_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </span>
            <span v-else>
              {{ match.finished_at || "-" }}
            </span>
          </div>
        </div>
        <div class="flex gap-2 justify-center mt-2">
          <span class="px-2 py-1 rounded text-xs border border-gray-200">
            Shuttlecock No:
            <span
              v-if="match.shuttlecockNumbers && match.shuttlecockNumbers.length"
            >
              {{ match.shuttlecockNumbers.join(", ") }}
            </span>
            <span v-else> None </span>
          </span>
        </div>
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm"
        >
          <div class="flex w-full items-center justify-between gap-4 mt-1">
            <span class="flex-1 text-right font-medium text-gray-700">
              {{
                match.teams[0].players
                  .map((pid) => playerNames[pid] || pid)
                  .join(" & ")
              }}
            </span>
            <span class="mx-2 text-gray-400 font-bold">vs</span>
            <span class="flex-1 text-left font-medium text-gray-700">
              {{
                match.teams[1].players
                  .map((pid) => playerNames[pid] || pid)
                  .join(" & ")
              }}
            </span>
          </div>
        </div>
      </li>
    </ul>
    <div class="w-full h-[1px] bg-gray-200 -mt-4"></div>
    <div v-if="sortedMatches.length > 10" class="flex justify-center -mt-2">
      <button
        v-if="showCount < sortedMatches.length"
        @click="showCount = sortedMatches.length"
        class="bg-white border border-gray-200 px-4 py-2 rounded-full font-semibold cursor-pointer hover:bg-gray-100 text-sm"
      >
        Show More
      </button>
      <button
        v-else
        @click="showCount = 10"
        class="bg-white border border-gray-200 px-4 py-2 rounded-full font-semibold cursor-pointer hover:bg-gray-100 text-sm"
      >
        Show Less
      </button>
    </div>
    <div
      v-if="matches.length === 0"
      class="text-gray-500 text-sm w-full text-center"
    >
      No matches found.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

const matches = ref([]);
const playerNames = ref({});
const showCount = ref(10);

const sortedMatches = computed(() =>
  [...matches.value].sort((a, b) => (b.finished_at || 0) - (a.finished_at || 0))
);

function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

onMounted(async () => {
  const todayStr = getTodayString();
  const matchesQuery = query(
    collection(db, "matches"),
    where("date", "==", todayStr)
  );
  onSnapshot(matchesQuery, (snapshot) => {
    matches.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });

  const playersSnapshot = await getDocs(collection(db, "players"));
  playersSnapshot.forEach((doc) => {
    playerNames.value[doc.id] = doc.data().name;
  });
});
</script>

<style lang="scss" scoped></style>