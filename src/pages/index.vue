<template>
  <div class="w-full h-screen flex justify-center items-center p-3">
    <div v-if="loading" class="flex justify-center items-center h-full">
      <svg
        class="animate-spin h-8 w-8 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div
      v-else
      class="w-full h-full flex flex-col gap-4 p-4 sm:p-6 rounded-xl bg-white border border-gray-200"
    >
      <div
        class="w-full flex flex-col gap-4 p-4 sm:p-6 rounded-xl bg-white border border-gray-200"
      >
        <div class="flex justify-between items-center gap-4">
          <div class="flex flex-col">
            <h2 class="text-base font-medium">Active Players</h2>
            <div class="text-sm">
              Today :
              <span class="text-sm text-gray-500">
                {{
                  new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                }}
              </span>
            </div>
          </div>
          <div class="flex items-center flex-col">
            <h3 class="text-sm text-gray-500 text-end">Total</h3>
            <h2 class="text-base font-semibold text-end">{{ activePlayers.length }}</h2>
          </div>
        </div>
        <div class="w-full h-[1px] bg-gray-200"></div>
        <div v-if="activePlayers.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">Name</th>
                <th scope="col" class="px-6 py-3">Level</th>
                <th scope="col" class="px-6 py-3">Gender</th>
                <th scope="col" class="px-6 py-3">Matches</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="player in activePlayers"
                :key="player.id"
                class="bg-white"
              >
                <th
                  scope="row"
                  class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                >
                  {{ player.name }}
                </th>
                <td class="px-6 py-2">
                  {{ player.level }}
                </td>
                <td class="px-6 py-2">
                  {{ player.gender }}
                </td>
                <td class="px-6 py-2">
                  {{ getDailyStat(player, "matches") }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="activePlayers.length === 0"
          class="text-gray-500 text-sm w-full text-center"
        >
          No active players found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const loading = ref(false);
const activePlayers = ref([]);

function isActiveToday(player) {
  if (!player.activeDates || !Array.isArray(player.activeDates)) return false;
  const today = new Date().toDateString();
  return player.activeDates.some((ts) => {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toDateString() === today;
  });
}

function getDateKey(date) {
  // YYYY-MM-DD
  return date ? date.toISOString().split("T")[0] : "";
}

function getDailyStat(player, field) {
  const key = getDateKey(new Date());
  return player.dailyStats && player.dailyStats[key]
    ? player.dailyStats[key][field] ?? 0
    : field === "payment"
    ? "not_paid"
    : 0;
}

async function updatePayment(player, value) {
  const playerDoc = doc(db, "players", player.id);
  let dailyStats = player.dailyStats || {};
  const key = getDateKey(new Date());
  if (!dailyStats[key]) {
    dailyStats[key] = { matches: 0, price: 0, payment: "not_paid" };
  }
  dailyStats[key].payment = value;
  await updateDoc(playerDoc, { dailyStats });
  await fetchPlayers();
}

const fetchPlayers = async () => {
  loading.value = true;
  const snapshot = await getDocs(collection(db, "players"));
  const allPlayers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  activePlayers.value = allPlayers.filter(isActiveToday);
  loading.value = false;
};

onMounted(fetchPlayers);
</script>

<style lang="scss" scoped></style>