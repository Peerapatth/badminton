<template>
  <div class="flex flex-col">
    <h2 class="text-base font-medium">Badminton Courts</h2>
    <div class="w-full h-[1px] bg-gray-200 mt-2"></div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div
        v-for="(court, idx) in courts"
        :key="court.courtID"
        class="bg-green-50 border-4 border-green-700 rounded-xl shadow p-4 flex flex-col items-center"
      >
        <h3 class="text-base font-semibold mb-2">Court {{ court.courtID }}</h3>
        <div
          class="relative w-full max-w-xs h-44 flex items-center justify-center bg-white rounded-xl border border-gray-300"
        >
          <!-- Team 1 Area -->
          <div
            class="absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center items-center px-2 group cursor-pointer relative"
            v-if="canShowWinButton(court, 0)"
            @click="setTeamResult(idx, 0, 'win')"
          >
            <span class="font-semibold text-xs mb-2 text-gray-500">Team 1</span>
            <div
              v-for="(player, pIdx) in court.teams[0].players"
              :key="pIdx"
              class="mb-1 flex items-center gap-2"
            >
              <div v-if="player" class="p-2 border border-gray-200 rounded-lg">
                <span class="text-sm font-semibold">
                  {{ getPlayerName(player) }}
                </span>
                
              </div>
              <div v-else class="p-1 border border-gray-200 rounded">
                <select
                  v-model="court.teams[0].players[pIdx]"
                  class="rounded w-[120px] outline-none cursor-pointer text-sm"
                  @change="emitPlayingStatus"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in activePlayers"
                    :key="p.id"
                    :value="p.id"
                    :disabled="isPlayerAssigned(p.id, idx, 0, pIdx)"
                  >
                    {{ p.name }}
                  </option>
                </select>
              </div>
            </div>
            <div
              class="absolute inset-0 flex items-center justify-center bg-green-600 bg-opacity-80 opacity-0 group-hover:opacity-100 transition rounded-l-xl"
              style="z-index: 10"
            >
              <span class="text-white text-lg font-bold">Win</span>
            </div>
          </div>
          <div
            v-else
            class="absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center items-center px-2 group"
          >
            <span class="font-semibold text-xs mb-2 text-gray-500">Team 1</span>
            <div
              v-for="(player, pIdx) in court.teams[0].players"
              :key="pIdx"
              class="mb-1 flex items-center gap-2"
            >
              <div v-if="player" class="p-2 border border-gray-200 rounded-lg">
                <span class="text-sm font-semibold">
                  {{ getPlayerName(player) }}
                </span>
          
                <button
                  class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold cursor-pointer ml-2"
                  @click="clearPlayer(idx, 0, pIdx)"
                >
                  Clear
                </button>
              </div>
              <div v-else class="p-1 border border-gray-200 rounded">
                <select
                  v-model="court.teams[0].players[pIdx]"
                  class="rounded w-[120px] outline-none cursor-pointer text-sm"
                  @change="emitPlayingStatus"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in activePlayers"
                    :key="p.id"
                    :value="p.id"
                    :disabled="isPlayerAssigned(p.id, idx, 0, pIdx)"
                  >
                    {{ p.name }}
                  </option>
                </select>
              </div>
            </div>
            <div
              v-if="court.teams[0].result && court.teams[0].result !== '-'"
              class="mt-2"
            >
              <span
                class="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold"
              >
                {{ court.teams[0].result }}
              </span>
            </div>
          </div>
          <div
            class="absolute left-1/2 top-0 h-full w-1 border-l-2 border-green-700"
          ></div>
          <div
            class="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center items-center px-2 group cursor-pointer relative"
            v-if="canShowWinButton(court, 1)"
            @click="setTeamResult(idx, 1, 'win')"
          >
            <span class="font-semibold text-xs mb-2 text-gray-500">Team 2</span>
            <div
              v-for="(player, pIdx) in court.teams[1].players"
              :key="pIdx"
              class="mb-1 flex items-center gap-2"
            >
              <div v-if="player" class="p-2 border border-gray-200 rounded-lg ml-2">
                <span class="text-sm font-semibold">
                  {{ getPlayerName(player) }}
                </span>
              </div>
              <div v-else class="p-1 border border-gray-200 rounded">
                <select
                  v-model="court.teams[1].players[pIdx]"
                  class="rounded w-[120px] outline-none cursor-pointer text-sm"
                  @change="emitPlayingStatus"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in activePlayers"
                    :key="p.id"
                    :value="p.id"
                    :disabled="isPlayerAssigned(p.id, idx, 1, pIdx)"
                  >
                    {{ p.name }}
                  </option>
                </select>
              </div>
            </div>
            <div
              class="absolute inset-0 flex items-center justify-center bg-green-600 bg-opacity-80 opacity-0 group-hover:opacity-100 transition rounded-r-xl"
              style="z-index: 10"
            >
              <span class="text-white text-lg font-bold">Win</span>
            </div>
          </div>
          <div
            v-else
            class="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center items-center px-2 group"
          >
            <span class="font-semibold text-xs mb-2 text-gray-500">Team 2</span>
            <div
              v-for="(player, pIdx) in court.teams[1].players"
              :key="pIdx"
              class="mb-1 flex items-center gap-2"
            >
              <div
                v-if="player"
                class="p-2 border border-gray-200 rounded-lg flex items-center gap-2"
              >
                <span class="text-sm font-semibold">
                  {{ getPlayerName(player) }}
                </span>
                <button
                  class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold cursor-pointer"
                  @click="clearPlayer(idx, 0, pIdx)"
                >
                  Clear
                </button>
              </div>
              <div v-else class="p-1 border border-gray-200 rounded">
                <select
                  v-model="court.teams[1].players[pIdx]"
                  class="rounded w-[120px] outline-none cursor-pointer text-sm"
                  @change="emitPlayingStatus"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in activePlayers"
                    :key="p.id"
                    :value="p.id"
                    :disabled="isPlayerAssigned(p.id, idx, 1, pIdx)"
                  >
                    {{ p.name }}
                  </option>
                </select>
              </div>
            </div>
            <div
              v-if="court.teams[1].result && court.teams[1].result !== '-'"
              class="mt-2"
            >
              <span
                class="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold"
              >
                {{ court.teams[1].result }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button
            v-if="canShowStartMatch(court)"
            class="bg-white border border-gray-200 px-4 py-2 rounded-full font-semibold cursor-pointer hover:bg-green-600 hover:text-white text-sm"
            @click="startMatch(idx)"
          >
            Start Match
          </button>
          <div
            v-if="
              court.teams[0].result === '-' || court.teams[1].result === '-'
            "
            class="bg-white border border-red-600 px-4 py-2 rounded-full font-semibold text-sm text-red-600"
          >
            <span
              class="animate-ping inline-block w-2 h-2 bg-red-600 rounded-full mr-2"
            ></span>
            Match in Progress
          </div>
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
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const props = defineProps({
  activePlayers: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["updatePlayingStatus"]);
const courts = ref([]);

onMounted(async () => {
  const todayKey = new Date().toISOString().split("T")[0];
  courts.value = Array.from({ length: 4 }, (_, i) => ({
    courtID: i + 1,
    status: "not done",
    teams: [
      { players: ["", ""], result: "" },
      { players: ["", ""], result: "" },
    ],
  }));

  const q = query(collection(db, "courts"), where("date", "==", todayKey));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docSnap) => {
    const match = docSnap.data();
    const idx = courts.value.findIndex((c) => c.courtID === match.court_id);
    if (idx !== -1) {
      courts.value[idx].status = match.status;
      courts.value[idx].teams = match.teams;
    }
  });
  emitPlayingStatus();
});

function clearPlayer(courtIdx, teamIdx, playerIdx) {
  courts.value[courtIdx].teams[teamIdx].players[playerIdx] = "";
  emitPlayingStatus();
}

function getPlayerName(playerId) {
  const player = props.activePlayers.find((p) => p.id === playerId);
  return player ? player.name : "";
}

function isPlayerAssigned(playerId, courtIdx, teamIdx, playerIdx) {
  return courts.value.some((court, cIdx) =>
    court.teams.some((team, tIdx) =>
      team.players.some(
        (p, pIdx) =>
          p === playerId &&
          !(cIdx === courtIdx && tIdx === teamIdx && pIdx === playerIdx)
      )
    )
  );
}

function canShowWinButton(court, teamIdx) {
  return (
    court.status === "not done" &&
    court.teams[teamIdx].result === "-" &&
    court.teams[teamIdx].players.every((p) => p)
  );
}

function canShowStartMatch(court) {
  return (
    court.status === "not done" &&
    court.teams[0].players.every((p) => p) &&
    court.teams[1].players.every((p) => p) &&
    court.teams[0].result === "" &&
    court.teams[1].result === ""
  );
}

// Emit assigned player IDs to parent
function emitPlayingStatus() {
  const assignedPlayerIds = courts.value.flatMap((court) =>
    court.teams.flatMap((team) => team.players.filter(Boolean))
  );
  emit("updatePlayingStatus", assignedPlayerIds);
}

async function setTeamResult(idx, teamIdx, result) {
  courts.value[idx].teams[teamIdx].result = result;
  const otherTeamIdx = teamIdx === 0 ? 1 : 0;
  courts.value[idx].teams[otherTeamIdx].result =
    result === "win" ? "lose" : "win";
  courts.value[idx].status = "done";
  await addMatchToFirebase(courts.value[idx]);
  await addToCollect(courts.value[idx]);
  await updatePlayersDailyStats(courts.value[idx].teams);
  setTimeout(() => {
    resetCourt(idx);
    emitPlayingStatus();
  }, 100);
}

async function addToCollect(courtData) {
  const todayKey = new Date().toISOString().split("T")[0];
  const collectRef = collection(db, "matches");
  try {
    await addDoc(collectRef, {
      court_id: courtData.courtID,
      date: todayKey,
      teams: courtData.teams,
      status: courtData.status,
      finished_at: Date.now(),
    });
  } catch (error) {
    console.error("Error adding to collect:", error);
  }
}

function getMatchPrice(matchCount) {
  return 137 + 22 * matchCount;
}

async function updatePlayersDailyStats(teams) {
  const todayKey = new Date().toISOString().split("T")[0];
  for (const team of teams) {
    const result = team.result;
    for (const playerId of team.players) {
      if (!playerId) continue;
      const playerRef = doc(db, "players", playerId);
      const playerSnap = await getDoc(playerRef);
      if (playerSnap.exists()) {
        const playerData = playerSnap.data();
        const dailyStats = playerData.dailyStats || {};
        const statsForToday = dailyStats[todayKey] || {};
        const matchesCount =
          typeof statsForToday.matches === "number" ? statsForToday.matches : 0;
        const newMatchesCount = matchesCount + 1;
        const prevPrice =
          typeof statsForToday.price === "number" ? statsForToday.price : 0;
        const newPrice = prevPrice + getMatchPrice(matchesCount);
        const winCount =
          typeof statsForToday.wins === "number" ? statsForToday.wins : 0;
        const loseCount =
          typeof statsForToday.loses === "number" ? statsForToday.loses : 0;
        await updateDoc(playerRef, {
          [`dailyStats.${todayKey}.matches`]: newMatchesCount,
          [`dailyStats.${todayKey}.price`]: newPrice,
          [`dailyStats.${todayKey}.wins`]:
            result === "win" ? winCount + 1 : winCount,
          [`dailyStats.${todayKey}.loses`]:
            result === "lose" ? loseCount + 1 : loseCount,
        });
      }
    }
  }
}

function resetCourt(idx) {
  courts.value[idx].teams = [
    { players: ["", ""], result: "" },
    { players: ["", ""], result: "" },
  ];
  courts.value[idx].status = "not done";
  const todayKey = new Date().toISOString().split("T")[0];
  const matchesRef = collection(db, "courts");
  const q = query(
    matchesRef,
    where("court_id", "==", courts.value[idx].courtID),
    where("date", "==", todayKey)
  );
  getDocs(q).then(async (querySnapshot) => {
    if (!querySnapshot.empty) {
      const matchDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "courts", matchDoc.id), {
        teams: courts.value[idx].teams,
        status: courts.value[idx].status,
      });
    } else {
      await addDoc(matchesRef, {
        court_id: courts.value[idx].courtID,
        date: todayKey,
        teams: courts.value[idx].teams,
        status: courts.value[idx].status,
      });
    }
  });
}

async function startMatch(idx) {
  if (
    courts.value[idx].teams[0].players.every((p) => p) &&
    courts.value[idx].teams[1].players.every((p) => p)
  ) {
    courts.value[idx].teams[0].result = "-";
    courts.value[idx].teams[1].result = "-";
    courts.value[idx].status = "not done";
    await addMatchToFirebase(courts.value[idx]);
    emitPlayingStatus();
    emit(
      "updatePlayingStatus",
      courts.value.flatMap((court) =>
        court.teams.flatMap((team) => team.players.filter(Boolean))
      )
    );
  }
}

async function addMatchToFirebase(courtData) {
  const todayKey = new Date().toISOString().split("T")[0];
  const matchesRef = collection(db, "courts");
  const q = query(
    matchesRef,
    where("court_id", "==", courtData.courtID),
    where("date", "==", todayKey)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const matchDoc = querySnapshot.docs[0];
    try {
      await updateDoc(doc(db, "courts", matchDoc.id), {
        teams: courtData.teams,
        status: courtData.status,
      });
    } catch (error) {
      console.error("Error updating match:", error);
    }
  } else {
    try {
      await addDoc(matchesRef, {
        court_id: courtData.courtID,
        date: todayKey,
        teams: courtData.teams,
        status: courtData.status,
      });
    } catch (error) {
      console.error("Error adding match:", error);
    }
  }
}
</script>

<style lang="scss" scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1 !important;
}
</style>
