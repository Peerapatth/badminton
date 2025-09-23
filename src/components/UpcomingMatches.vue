<template>
  <div
    class="w-full flex flex-col gap-8 p-6 sm:p-8 rounded-xl bg-white border border-gray-200 shadow"
  >
    <h2 class="text-lg font-semibold text-gray-800">Upcoming Matches</h2>
    <div class="w-full h-[1px] bg-gray-200 -mt-4"></div>

    <ul
      v-if="upcomingMatches.length"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <li
        v-for="match in upcomingMatches"
        :key="match.id"
        class="flex flex-col gap-2 mb-4 p-4 rounded-lg border border-gray-200 bg-yellow-50"
      >
        <div class="flex flex-col gap-1 text-base mt-2">
          <div>
            <span class="text-gray-700 font-semibold">Team 1:</span>
            <span class="text-gray-600">
              {{
                match.teams[0].players
                  .map((pid) => playerLabel(pid))
                  .join(" & ")
              }}
            </span>
          </div>
          <div>
            <span class="text-gray-700 font-semibold">Team 2:</span>
            <span class="text-gray-600">
              {{
                match.teams[1].players
                  .map((pid) => playerLabel(pid))
                  .join(" & ")
              }}
            </span>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="text-gray-500 text-base w-full text-center mt-4">
      No upcoming matches.
    </div>

    <div class="w-full h-[1px] bg-gray-200 -mt-4"></div>
    <form @submit.prevent="addUpcomingMatch" class="flex flex-col gap-6">
      <h2 class="text-base font-semibold w-full text-center">
        Add Upcoming Match
      </h2>
      <div class="grid grid-cols-1 md:w-1/2 gap-4 mx-auto">
        <div
          class="relative p-4 gap-4 flex items-center justify-center bg-white rounded-xl border border-gray-200"
        >
          <div class="flex-1 p-4 rounded-lg border border-gray-200">
            <label class="block text-sm font-semibold mb-2 text-gray-700"
              >Team 1</label
            >
            <div class="p-1 border border-gray-200 rounded mb-3">
              <select
                v-model="team1Player1"
                class="rounded w-full outline-none cursor-pointer text-sm"
              >
                <option value="">Select Player 1</option>
                <option v-for="p in allPlayers" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ p.level }})
                </option>
              </select>
            </div>
            <div class="p-1 border border-gray-200 rounded">
              <select
                v-model="team1Player2"
                class="rounded w-full outline-none cursor-pointer text-sm"
              >
                <option value="">Select Player 2</option>
                <option v-for="p in allPlayers" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ p.level }})
                </option>
              </select>
            </div>
          </div>
          <div class="block text-sm font-semibold mb-2 text-gray-700">VS</div>
          <div class="flex-1 p-4 rounded-lg border border-gray-200">
            <label class="block text-sm font-semibold mb-2 text-gray-700"
              >Team 2</label
            >
            <div class="p-1 border border-gray-200 rounded mb-3">
              <select
                v-model="team2Player1"
                class="rounded w-full outline-none cursor-pointer text-sm"
              >
                <option value="">Select Player 1</option>
                <option v-for="p in allPlayers" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ p.level }})
                </option>
              </select>
            </div>
            <div class="p-1 border border-gray-200 rounded">
              <select
                v-model="team2Player2"
                class="rounded w-full outline-none cursor-pointer text-sm"
              >
                <option value="">Select Player 2</option>
                <option v-for="p in allPlayers" :key="p.id" :value="p.id">
                  {{ p.name }} ({{ p.level }})
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="bg-white border border-gray-200 px-4 py-2 rounded-full font-semibold cursor-pointer hover:bg-gray-100 text-sm"
        >
          Add Match
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
} from "firebase/firestore";

const upcomingMatches = ref([]);
const allPlayers = ref([]);
const playerMap = ref({});

const team1Player1 = ref("");
const team1Player2 = ref("");
const team2Player1 = ref("");
const team2Player2 = ref("");

onMounted(async () => {
  const playersSnapshot = await getDocs(collection(db, "players"));
  allPlayers.value = playersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  playerMap.value = {};
  allPlayers.value.forEach((p) => {
    playerMap.value[p.id] = p;
  });

  const matchesQuery = query(
    collection(db, "matches"),
    where("status", "==", "not done")
  );
  onSnapshot(matchesQuery, (snapshot) => {
    upcomingMatches.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });
});

function playerLabel(pid) {
  const p = playerMap.value[pid];
  return p ? `${p.name} (${p.level})` : pid;
}

async function addUpcomingMatch() {
  if (
    !team1Player1.value ||
    !team1Player2.value ||
    !team2Player1.value ||
    !team2Player2.value
  ) {
    alert("Please select all players.");
    return;
  }
  await addDoc(collection(db, "matches"), {
    status: "not done",
    teams: [
      { players: [team1Player1.value, team1Player2.value], result: "" },
      { players: [team2Player1.value, team2Player2.value], result: "" },
    ],
  });
  team1Player1.value = "";
  team1Player2.value = "";
  team2Player1.value = "";
  team2Player2.value = "";
}
</script>

<style lang="scss" scoped></style>
