<template>
  <div class="flex flex-col">
    <div class="flex flex-col">
      <h2 class="text-base font-medium">Badminton Courts</h2>
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

    <div class="w-full h-[1px] bg-gray-200 mt-2"></div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div
        v-for="(court, idx) in courts"
        :key="court.courtID"
        class="bg-green-50 border-4 border-green-700 rounded-xl shadow p-4 flex flex-col items-center"
      >
        <h3 class="text-base font-semibold mb-2">Court {{ court.courtID }}</h3>
        <div class="mb-2 w-full flex items-center gap-2 justify-center">
          <label class="text-sm font-medium text-gray-700"
            >Shuttlecock No:</label
          >
          <input
            type="number"
            min="1"
            class="border rounded px-2 py-1 w-12 text-sm text-center border-gray-200 outline-none"
            v-model="court.newShuttlecock"
            placeholder="No."
          />
          <button
            class="px-4 py-2 rounded-full font-medium bg-white border border-gray-200 text-xs cursor-pointer hover:bg-green-600 hover:text-white transition"
            @click="addShuttlecock(idx)"
          >
            Add
          </button>
        </div>
        <div
          v-if="court.shuttlecockNumbers.length"
          class="text-sm mb-2 flex flex-wrap gap-2"
        >
          <span
            v-for="(num, i) in court.shuttlecockNumbers"
            :key="num"
            class="flex items-center gap-1 px-2 py-1 rounded border border-gray-300"
          >
            {{ num }}
            <button
              class="text-xs text-red-600 bg-red-100 rounded px-1 ml-1 hover:bg-red-200 cursor-pointer"
              @click="deleteShuttlecock(idx, i)"
              title="Delete"
            >
              ×
            </button>
          </span>
        </div>
        <div
          class="relative w-full max-w-xs h-44 flex items-center justify-center bg-white rounded-xl border-2 border-green-700"
        >
          <!-- Team 1 -->
          <div
            class="absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center items-center px-2 group"
            v-if="canShowDoneButton(court, 0)"
          >
            <span class="font-semibold text-xs mb-2 text-gray-500">Team 1</span>
            <div
              v-for="(player, pIdx) in court.teams[0].players"
              :key="pIdx"
              class="mb-1 flex items-center gap-2"
            >
              <div v-if="player" class="p-2 border border-gray-200 rounded-lg">
                <span class="text-sm font-medium">
                  {{ getPlayerName(player) }}
                </span>
              </div>
              <div v-else class="p-1 border border-gray-200 rounded">
                <select
                  v-model="court.teams[0].players[pIdx]"
                  class="rounded w-[120px] outline-none text-center cursor-pointer text-sm"
                  @change="emitPlayingStatus"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in availablePlayers(idx, 0, pIdx)"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }}
                  </option>
                </select>
              </div>
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
                <span class="text-sm font-medium">
                  {{ getPlayerName(player) }}
                </span>
                <button
                  class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold cursor-pointer ml-2"
                  @click="clearPlayer(idx, 0, pIdx)"
                >
                  x
                </button>
              </div>
              <div v-else class="p-1 border border-gray-200 rounded">
                <select
                  v-model="court.teams[0].players[pIdx]"
                  class="rounded w-[120px] outline-none text-center cursor-pointer text-sm"
                  @change="emitPlayingStatus"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in availablePlayers(idx, 0, pIdx)"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div
            class="absolute left-1/2 top-0 h-full w-1 border-l-2 border-green-700"
          ></div>
          <!-- Team 2 -->
          <div
            class="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center items-center px-2 group"
            v-if="canShowDoneButton(court, 1)"
          >
            <span class="font-semibold text-xs mb-2 text-gray-500">Team 2</span>
            <div
              v-for="(player, pIdx) in court.teams[1].players"
              :key="pIdx"
              class="mb-1 flex items-center gap-2"
            >
              <div
                v-if="player"
                class="p-2 border border-gray-200 rounded-lg ml-2"
              >
                <span class="text-sm font-medium">
                  {{ getPlayerName(player) }}
                </span>
              </div>
              <div v-else class="p-1 border border-gray-200 rounded">
                <select
                  v-model="court.teams[1].players[pIdx]"
                  class="rounded w-[120px] outline-none text-center cursor-pointer text-sm"
                  @change="emitPlayingStatus"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in availablePlayers(idx, 1, pIdx)"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }}
                  </option>
                </select>
              </div>
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
                <span class="text-sm font-medium">
                  {{ getPlayerName(player) }}
                </span>
                <button
                  class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold cursor-pointer"
                  @click="clearPlayer(idx, 1, pIdx)"
                >
                  x
                </button>
              </div>
              <div v-else class="p-1 border border-gray-200 rounded">
                <select
                  v-model="court.teams[1].players[pIdx]"
                  class="rounded w-[120px] outline-none text-center cursor-pointer text-sm"
                  @change="emitPlayingStatus"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in availablePlayers(idx, 1, pIdx)"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }}
                  </option>
                </select>
              </div>
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
              court.status === 'not done' &&
              (court.teams[0].result === '-' || court.teams[1].result === '-')
            "
            class="bg-white border border-red-600 px-4 py-2 rounded-full font-semibold text-sm text-red-600"
          >
            <span
              class="animate-ping inline-block w-2 h-2 bg-red-600 rounded-full mr-2"
            ></span>
            Match in Progress
          </div>
          <div
            v-if="
              court.status === 'not done' &&
              (court.teams[0].result === '-' || court.teams[1].result === '-')
            "
            @click="setTeamDone(idx)"
            class="bg-white border border-gray-200 px-4 py-2 rounded-full font-semibold cursor-pointer hover:bg-blue-600 hover:text-white text-sm"
          >
            Done
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
  Timestamp,
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
    shuttlecockNumbers: [],
    matchCount: 0,
    newShuttlecock: "",
  }));

  const q = query(collection(db, "courts"), where("date", "==", todayKey));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docSnap) => {
    const match = docSnap.data();
    const idx = courts.value.findIndex((c) => c.courtID === match.court_id);
    if (idx !== -1) {
      courts.value[idx].status = match.status;
      courts.value[idx].teams = match.teams;
      courts.value[idx].shuttlecockNumbers = match.shuttlecockNumbers || [];
      courts.value[idx].matchCount = match.matchCount || 0;
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

function canShowDoneButton(court, teamIdx) {
  return (
    court.status === "not done" &&
    court.teams[teamIdx].result === "-" &&
    court.teams[teamIdx].players.every((p) => p)
  );
}

function availablePlayers(courtIdx, teamIdx, playerIdx) {
  return props.activePlayers.filter(
    (p) => !isPlayerAssigned(p.id, courtIdx, teamIdx, playerIdx)
  );
}

function canShowStartMatch(court) {
  return (
    court.status === "not done" &&
    court.teams[0].players.every((p) => p) &&
    court.teams[1].players.every((p) => p) &&
    court.teams[0].result === "" &&
    court.teams[1].result === "" &&
    court.shuttlecockNumbers.length > 0
  );
}

function deleteShuttlecock(courtIdx, shuttlecockIdx) {
  courts.value[courtIdx].shuttlecockNumbers.splice(shuttlecockIdx, 1);
  updateShuttlecockInDB(courtIdx);
}

function emitPlayingStatus() {
  const assignedPlayerIds = courts.value.flatMap((court) =>
    court.teams.flatMap((team) => team.players.filter(Boolean))
  );
  emit("updatePlayingStatus", assignedPlayerIds);
}

function addShuttlecock(idx) {
  const value = Number(courts.value[idx].newShuttlecock);
  if (
    !isNaN(value) &&
    value > 0 &&
    !courts.value[idx].shuttlecockNumbers.includes(value)
  ) {
    courts.value[idx].shuttlecockNumbers.push(value);
    courts.value[idx].newShuttlecock = "";
    updateShuttlecockInDB(idx);
  }
}

async function updateShuttlecockInDB(idx) {
  const todayKey = new Date().toISOString().split("T")[0];
  const matchesRef = collection(db, "courts");
  const q = query(
    matchesRef,
    where("court_id", "==", courts.value[idx].courtID),
    where("date", "==", todayKey)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const matchDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, "courts", matchDoc.id), {
      shuttlecockNumbers: courts.value[idx].shuttlecockNumbers,
      teams: courts.value[idx].teams,
      status: courts.value[idx].status,
    });
  }
}

function setTeamDone(idx) {
  courts.value[idx].status = "done";
  courts.value[idx].teams[0].result = "";
  courts.value[idx].teams[1].result = "";
  addMatchToFirebase(courts.value[idx]);
  addToCollect(courts.value[idx]);
  updatePlayersDailyStats(
    courts.value[idx].teams,
    courts.value[idx].matchCount,
    courts.value[idx].shuttlecockNumbers
  );
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
      shuttlecockNumbers: courtData.shuttlecockNumbers,
    });
  } catch (error) {
    console.error("Error adding to collect:", error);
  }
}

function getMatchPrice(shuttlecockCount) {
  return 137 + 22 * shuttlecockCount;
}

async function updatePlayersDailyStats(teams, matchCount, shuttlecockNumbers) {
  const todayKey = new Date().toISOString().split("T")[0];
  const shuttlecockUsed = Array.isArray(shuttlecockNumbers)
    ? shuttlecockNumbers.length
    : 0;
  for (const team of teams) {
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
        const shuttlecockCount =
          typeof statsForToday.shuttlecock === "number"
            ? statsForToday.shuttlecock
            : 0;
        const newShuttlecockCount = shuttlecockCount + shuttlecockUsed;
        const prevPrice =
          typeof statsForToday.price === "number" ? statsForToday.price : 0;
        const newPrice = getMatchPrice(newShuttlecockCount);
        await updateDoc(playerRef, {
          [`dailyStats.${todayKey}.matches`]: newMatchesCount,
          [`dailyStats.${todayKey}.shuttlecock`]: newShuttlecockCount,
          [`dailyStats.${todayKey}.price`]: newPrice,
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
  courts.value[idx].shuttlecockNumbers = [];
  courts.value[idx].matchCount = 0;
  courts.value[idx].newShuttlecock = "";
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
        shuttlecockNumbers: courts.value[idx].shuttlecockNumbers,
        matchCount: courts.value[idx].matchCount,
      });
    } else {
      await addDoc(matchesRef, {
        court_id: courts.value[idx].courtID,
        date: todayKey,
        teams: courts.value[idx].teams,
        status: courts.value[idx].status,
        shuttlecockNumbers: courts.value[idx].shuttlecockNumbers,
        matchCount: courts.value[idx].matchCount,
      });
    }
  });
}

async function startMatch(idx) {
  if (
    courts.value[idx].teams[0].players.every((p) => p) &&
    courts.value[idx].teams[1].players.every((p) => p) &&
    courts.value[idx].shuttlecockNumbers.length > 0
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
        shuttlecockNumbers: courtData.shuttlecockNumbers,
        matchCount: courtData.matchCount,
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
        shuttlecockNumbers: courtData.shuttlecockNumbers,
        matchCount: courtData.matchCount,
      });
    } catch (error) {
      console.error("Error adding match:", error);
    }
  }
}

defineExpose({ addMatchToCourt });
async function addMatchToCourt(match) {
  const idx = courts.value.findIndex(
    (court) =>
      court.status === "not done" &&
      court.teams[0].players.every((p) => !p) &&
      court.teams[1].players.every((p) => !p)
  );
  if (idx === -1) {
    alert("No available court!");
    return;
  }
  courts.value[idx].teams = JSON.parse(JSON.stringify(match.teams));
  courts.value[idx].status = "not done";
  courts.value[idx].matchCount = (courts.value[idx].matchCount || 0) + 1;
  await addMatchToFirebase(courts.value[idx]);
  emitPlayingStatus();
}
</script>

<style lang="scss" scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1 !important;
}
</style>
