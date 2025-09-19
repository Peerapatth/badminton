<template>
  <div class="w-full min-h-screen flex justify-center items-start p-3">
    <div
      class="w-full h-full flex flex-col gap-4 p-4 sm:p-6 rounded-xl bg-white border border-gray-200"
    >
      <Courts
        :activePlayers="activePlayers"
        @updatePlayingStatus="handlePlayingStatus"
      />
      <Matches />
      <div
        class="w-full flex flex-col gap-4 p-4 sm:p-6 rounded-xl bg-white border border-gray-200"
      >
        <div class="flex justify-between items-center gap-4">
          <div class="flex flex-col">
            <h2 class="text-base font-medium">Active Players</h2>
          </div>
          <div class="flex items-center flex-col">
            <h3 class="text-sm text-gray-500 text-end">Total</h3>
            <h2 class="text-base font-semibold text-end">
              {{ activePlayers.length }}
            </h2>
          </div>
        </div>
        <div class="w-full h-[1px] bg-gray-200"></div>
        <div v-if="activePlayers.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">Name</th>
                <th scope="col" class="px-6 py-3 text-center">Level</th>
                <th scope="col" class="px-6 py-3 text-center">
                  Playing Status
                </th>
                <th scope="col" class="px-6 py-3 text-center">Matches</th>
                <th scope="col" class="px-6 py-3 text-center">Win/Lose</th>
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
                <td class="px-6 py-2 text-center">
                  {{ player.level }}
                </td>
                <td class="px-6 py-2 text-center">
                  {{ player.playingStatus }}
                </td>
                <td class="px-6 py-2 text-center">
                  {{ getDailyStat(player, "matches") }}
                </td>
                <td class="px-6 py-2 text-center">
                  {{ getWinLoseSummary(player) }}
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
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import Matches from "@/components/Matches.vue";
import Courts from "@/components/Courts.vue";

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

function getWinLoseSummary(player) {
  const key = getDateKey(new Date());
  return player.dailyStats && player.dailyStats[key]
    ? `${player.dailyStats[key].win} - ${player.dailyStats[key].lose}`
    : "0 - 0";
}

async function handlePlayingStatus(assignedPlayerIds) {
  for (const player of activePlayers.value) {
    const newStatus = assignedPlayerIds.includes(player.id)
      ? "playing"
      : "break";
    if (player.playingStatus !== newStatus) {
      const playerDoc = doc(db, "players", player.id);
      await updateDoc(playerDoc, { playingStatus: newStatus });
    }
  }
}

onMounted(() => {
  const playersRef = collection(db, "players");
  onSnapshot(playersRef, (snapshot) => {
    const allPlayers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    activePlayers.value = allPlayers.filter(isActiveToday);
  });
});
</script>

<style lang="scss" scoped></style>
