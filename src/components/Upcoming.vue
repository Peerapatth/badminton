<template>
  <div
    class="w-full flex flex-col gap-8 p-6 sm:p-8 rounded-xl bg-white border border-gray-200 shadow"
  >
    <h2 class="text-lg font-semibold text-gray-800">
      <span
        class="animate-ping inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"
      ></span>
      Upcoming Matches
    </h2>
    <div class="w-full h-[1px] bg-gray-200 -mt-4"></div>
    <ul
      v-if="upcomingMatches.length"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <li
        v-for="match in upcomingMatches"
        :key="match.id"
        class="flex flex-col gap-2 mb-4 p-4 rounded-lg border border-gray-200"
      >
        <div class="flex gap-2 justify-center mt-2">
          <div class="px-2 py-1 rounded text-sm">
            {{
              match.teams[0].players
                .map((pid) => playerNameWithoutLevel(pid))
                .join(" &\n ")
            }}
          </div>
          <span class="mx-2 text-gray-400 font-bold">vs</span>
          <div class="px-2 py-1 rounded text-sm">
            {{
              match.teams[1].players
                .map((pid) => playerNameWithoutLevel(pid))
                .join(" &\n ")
            }}
          </div>
        </div>
        <div class="flex gap-2 justify-center mt-2">
          <button
            @click="addToCourt(match.id)"
            class="bg-white border border-gray-200 px-4 py-2 rounded-full font-medium cursor-pointer hover:bg-green-600 hover:text-white text-sm"
          >
            Add To Court
          </button>
          <button
            @click="deleteMatch(match.id)"
            class="bg-white border border-gray-200 px-4 py-2 rounded-full font-medium cursor-pointer hover:bg-red-600 hover:text-white text-sm"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
    <div v-else class="text-gray-500 w-full text-center text-sm">
      No upcoming matches.
    </div>

    <div class="w-full h-[1px] bg-gray-200 -mt-4"></div>
    <form @submit.prevent="addUpcomingMatch" class="flex flex-col gap-6">
      <h2 class="text-base font-semibold w-full text-center">
        Add Upcoming Match
      </h2>
      <div class="grid grid-cols-1 md:w-auto gap-4 mx-auto">
        <div
          class="relative p-4 gap-4 flex flex-col md:flex-row items-center justify-center bg-white rounded-xl border border-gray-200"
        >
          <div class="flex-1 p-4 rounded-lg border border-gray-200">
            <label class="block text-sm font-semibold mb-2 text-gray-700"
              >Team 1</label
            >
            <div
              class="p-1 border border-gray-200 rounded mb-3 flex items-center gap-2"
            >
              <template v-if="team1Player1">
                <span class="font-medium text-gray-800 text-sm w-full">{{
                  playerName(team1Player1)
                }}</span>
                <button
                  type="button"
                  @click="team1Player1 = ''"
                  class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold cursor-pointer"
                  title="Clear"
                >
                  &times;
                </button>
              </template>
              <template v-else>
                <select
                  v-model="team1Player1"
                  class="rounded max-w-60 outline-none text-center cursor-pointer text-sm"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in activePlayers.filter(
                      (ap) =>
                        !unavailablePlayerIds.includes(ap.id) &&
                        ap.id !== team1Player2 &&
                        ap.id !== team2Player1 &&
                        ap.id !== team2Player2
                    )"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }} ({{ p.level }})
                  </option>
                </select>
              </template>
            </div>
            <div
              class="p-1 border border-gray-200 rounded flex items-center gap-2"
            >
              <template v-if="team1Player2">
                <span class="font-medium text-gray-800 text-sm w-full">{{
                  playerName(team1Player2)
                }}</span>
                <button
                  type="button"
                  @click="team1Player2 = ''"
                  class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold cursor-pointer"
                  title="Clear"
                >
                  &times;
                </button>
              </template>
              <template v-else>
                <select
                  v-model="team1Player2"
                  class="rounded max-w-60 outline-none text-center cursor-pointer text-sm"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in activePlayers.filter(
                      (ap) =>
                        !unavailablePlayerIds.includes(ap.id) &&
                        ap.id !== team1Player1 &&
                        ap.id !== team2Player1 &&
                        ap.id !== team2Player2
                    )"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }} ({{ p.level }})
                  </option>
                </select>
              </template>
            </div>
          </div>
          <div class="block mx-2 text-gray-400 font-bold text-sm">VS</div>
          <div class="flex-1 p-4 rounded-lg border border-gray-200">
            <label class="block text-sm font-semibold mb-2 text-gray-700"
              >Team 2</label
            >
            <div
              class="p-1 border border-gray-200 rounded mb-3 flex items-center gap-2"
            >
              <template v-if="team2Player1">
                <div class="font-medium text-gray-800 text-sm w-full">
                  {{ playerName(team2Player1) }}
                </div>
                <button
                  type="button"
                  @click="team2Player1 = ''"
                  class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold cursor-pointer"
                  title="Clear"
                >
                  &times;
                </button>
              </template>
              <template v-else>
                <select
                  v-model="team2Player1"
                  class="rounded max-w-60 outline-none text-center cursor-pointer text-sm"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in activePlayers.filter(
                      (ap) =>
                        !unavailablePlayerIds.includes(ap.id) &&
                        ap.id !== team1Player1 &&
                        ap.id !== team1Player2 &&
                        ap.id !== team2Player2
                    )"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }} ({{ p.level }})
                  </option>
                </select>
              </template>
            </div>
            <div
              class="p-1 border border-gray-200 rounded flex items-center gap-2"
            >
              <template v-if="team2Player2">
                <span class="font-medium text-gray-800 text-sm w-full">{{
                  playerName(team2Player2)
                }}</span>
                <button
                  type="button"
                  @click="team2Player2 = ''"
                  class="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold cursor-pointer"
                  title="Clear"
                >
                  &times;
                </button>
              </template>
              <template v-else>
                <select
                  v-model="team2Player2"
                  class="rounded max-w-60 outline-none text-center cursor-pointer text-sm"
                >
                  <option value="">Select Player</option>
                  <option
                    v-for="p in activePlayers.filter(
                      (ap) =>
                        !unavailablePlayerIds.includes(ap.id) &&
                        ap.id !== team1Player1 &&
                        ap.id !== team1Player2 &&
                        ap.id !== team2Player1
                    )"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }} ({{ p.level }})
                  </option>
                </select>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center flex-row gap-2">
        <button
          type="button"
          @click="randomMatchByLevel"
          class="bg-white border border-gray-200 px-4 py-2 rounded-full font-semibold cursor-pointer hover:bg-gray-100 text-sm"
        >
          Random
        </button>
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
import { ref, onMounted, computed } from "vue";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
const emit = defineEmits(["addToCourt"]);

const upcomingMatches = ref([]);
const activePlayers = ref([]);
const allPlayers = ref([]);
const playerMap = ref({});
const selectedDate = ref(new Date());

const team1Player1 = ref("");
const team1Player2 = ref("");
const team2Player1 = ref("");
const team2Player2 = ref("");

const unavailablePlayerIds = computed(() =>
  upcomingMatches.value.flatMap((match) =>
    match.teams.flatMap((team) => team.players)
  )
);

function isActiveOnSelectedDate(player) {
  if (!player.activeDates || !Array.isArray(player.activeDates)) return false;
  return player.activeDates.some((ts) => {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toDateString() === selectedDate.value.toDateString();
  });
}

onMounted(async () => {
  const allSnapshot = await getDocs(collection(db, "players"));
  allPlayers.value = allSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  activePlayers.value = allPlayers.value.filter((player) =>
    isActiveOnSelectedDate(player)
  );
  playerMap.value = {};
  activePlayers.value.forEach((p) => {
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

async function addToCourt(id) {
  emit("addToCourt", id);
  await updateDoc(doc(db, "matches", id), { status: "not done" });
}

async function deleteMatch(id) {
  await deleteDoc(doc(db, "matches", id));
}

function playerName(pid) {
  const p = playerMap.value[pid];
  return p ? `${p.name} (${p.level})` : pid;
}

function playerNameWithoutLevel(pid) {
  const p = playerMap.value[pid];
  return p ? `${p.name}` : pid;
}

function randomMatchByLevel() {
  const availablePlayers = activePlayers.value.filter(
    (p) => !unavailablePlayerIds.value.includes(p.id)
  );
  if (availablePlayers.length < 4) {
    alert("Not enough available players to form two teams.");
    return;
  }
  let tries = 0;
  let selected = [];
  const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };

  while (tries < 20) {
    const shuffled = availablePlayers.slice().sort(() => Math.random() - 0.5);
    selected = shuffled.slice(0, 4);
    selected.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);

    const team1Levels = [selected[0].level, selected[3].level];
    const team2Levels = [selected[1].level, selected[2].level];

    const invalidTeam1 =
      team1Levels.includes("beginner") && team1Levels.includes("advanced");
    const invalidTeam2 =
      team2Levels.includes("beginner") && team2Levels.includes("advanced");

    if (!invalidTeam1 && !invalidTeam2) {
      break;
    }
    tries++;
  }

  if (tries === 20) {
    alert(
      "Could not find a balanced match without beginner and advanced together."
    );
    return;
  }

  team1Player1.value = selected[0].id;
  team1Player2.value = selected[3].id;
  team2Player1.value = selected[1].id;
  team2Player2.value = selected[2].id;
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
