<template>
  <div class="w-full min-h-screen bg-gray-100 flex justify-center items-start p-3">
    <div v-if="loading" class="flex justify-center items-center h-screen">
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
      <div class="flex justify-between items-center gap-4 px-2">
        <div class="flex flex-col">
          <h2 class="text-base font-semibold">List of Players</h2>
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
        <button
          @click="showPopup = true"
          class="bg-white border border-gray-200 px-4 py-2 rounded-full font-semibold cursor-pointer"
        >
          Add
        </button>
      </div>
      <div
        class="w-full flex flex-col gap-4 p-4 sm:p-6 rounded-xl bg-white border border-gray-200"
      >
        <div class="flex justify-between items-center gap-4">
          <div class="flex flex-col">
            <h2 class="text-base font-medium">Active Players</h2>
            <div class="text-sm text-gray-500">
              Date :
              {{
                selectedDate.toDateString() === new Date().toDateString()
                  ? "Today"
                  : selectedDateDisplay
              }}
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="showUnpaid = !showUnpaid"
              class="border border-gray-200 px-4 py-2 rounded-full font-medium cursor-pointer text-sm"
            >
              {{ showUnpaid ? "All" : "Unpaid" }}
            </button>
            <button
              @click="showSelectDate = true"
              class="bg-white border border-gray-200 p-2 rounded-lg font-semibold cursor-pointer"
            >
              <DateIcon class="inline-block" />
            </button>
          </div>
        </div>
        <div class="w-full h-[1px] bg-gray-200"></div>
        <div v-if="activePlayers.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">Name</th>
                <th scope="col" class="px-6 py-3 text-center">Matches</th>
                <th scope="col" class="px-6 py-3 text-center">Shuttlecock</th>
                <th scope="col" class="px-6 py-3 text-center">Price</th>
                <th scope="col" class="px-6 py-3">Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="player in filteredActivePlayers"
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
                  {{ getDailyStat(player, "matches") }}
                </td>
                <td class="px-6 py-2 text-center">
                  {{ getDailyStat(player, "shuttlecock") }}
                </td>
                <td class="px-6 py-2 text-center">
                  {{ getDailyStat(player, "price") }}
                </td>
                <td class="px-6 py-2">
                  <div class="p-2 border rounded-lg min-w-38 border-gray-200">
                    <div class="flex items-center gap-1">
                      <span
                        v-if="getDailyStat(player, 'payment') === 'not_paid'"
                        class="inline-block w-3 h-3 rounded-full bg-red-600"
                      ></span>
                      <span
                        v-else
                        class="inline-block w-3 h-3 rounded-full bg-green-600"
                      ></span>
                      <select
                        :value="getDailyStat(player, 'payment')"
                        @change="updatePayment(player, $event.target.value)"
                        class="rounded w-full outline-none cursor-pointer"
                      >
                        <option value="not_paid">Unpaid</option>
                        <option value="promptpay">PromptPay</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>
                  </div>
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
      <div
        class="w-full flex flex-col gap-4 p-4 sm:p-6 rounded-xl bg-white border border-gray-200"
      >
        <div class="flex justify-between items-center gap-4">
          <h2 class="text-base font-medium">All Players</h2>
          <button
            @click="showInactiveOnly = !showInactiveOnly"
            class="border border-gray-200 px-4 py-2 rounded-full font-medium cursor-pointer text-sm"
          >
            {{ showInactiveOnly ? "All Players" : "Only Inactive" }}
          </button>
        </div>
        <div class="w-full h-[1px] bg-gray-200"></div>
        <div v-if="allPlayers.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">Name</th>
                <th scope="col" class="px-6 py-3">Level</th>
                <th scope="col" class="px-6 py-3">Gender</th>
                <th scope="col" class="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="player in filteredAllPlayers"
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
                  <div class="p-2 border border-gray-200 rounded-lg min-w-38">
                    <select
                      v-model="player.level"
                      @change="updateLevel(player, $event.target.value)"
                      class="rounded w-full outline-none cursor-pointer"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </td>
                <td class="px-6 py-2">{{ player.gender }}</td>
                <td class="px-6 py-2">
                  <div
                    class="p-2 border border-gray-200 rounded-lg min-w-38 flex items-center"
                  >
                    <label class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        :checked="isActiveOnSelectedDate(player)"
                        @change="
                          updateStatus(
                            player,
                            $event.target.checked ? 'active' : 'inactive'
                          )
                        "
                        class="sr-only"
                      />
                      <span
                        class="w-11 h-5 flex items-center bg-gray-200 rounded-full p-1 transition-colors duration-200"
                        :class="
                          isActiveOnSelectedDate(player)
                            ? 'bg-green-500'
                            : ''
                        "
                      >
                        <span
                          class="bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200"
                          :class="
                            isActiveOnSelectedDate(player)
                              ? 'translate-x-5'
                              : 'translate-x-0'
                          "
                        ></span>
                      </span>
                      <span
                        class="ml-2 text-sm font-medium"
                  
                      >
                        {{
                          isActiveOnSelectedDate(player) ? "Active" : "Inactive"
                        }}
                      </span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-if="allPlayers.length === 0"
          class="text-gray-500 text-sm w-full text-center"
        >
          No players found.
        </div>
      </div>
      <AddPlayer
        v-if="showPopup"
        @close="showPopup = false"
        @add-player="addPlayer"
        :player-form="playerForm"
      />
      <SelectDate
        v-if="showSelectDate"
        @close="showSelectDate = false"
        @select-date="handleDate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import AddPlayer from "@/components/popups/AddPlayer.vue";
import SelectDate from "@/components/popups/SelectDate.vue";
import DateIcon from "@/assets/elements/Date.vue";

const showPopup = ref(false);
const showSelectDate = ref(false);
const showInactiveOnly = ref(false);
const showUnpaid = ref(false);
const loading = ref(false);

const playerForm = ref({
  name: "",
  matches: 0,
  gender: "",
  level: "",
  price: 0,
  status: "inactive",
});

const filteredAllPlayers = computed(() =>
  showInactiveOnly.value
    ? allPlayers.value.filter((p) => p.status === "inactive")
    : allPlayers.value
);

const filteredActivePlayers = computed(() =>
  showUnpaid.value
    ? activePlayers.value.filter(
        (p) => getDailyStat(p, "payment") === "not_paid"
      )
    : activePlayers.value
);

const selectedDate = ref(new Date());
const selectedDateDisplay = ref(formatDate(selectedDate.value));

const activePlayers = ref([]);
const allPlayers = ref([]);

function formatDate(date) {
  return date
    ? date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";
}

function getDateKey(date) {
  // Use YYYY-MM-DD as key
  return date ? date.toISOString().split("T")[0] : "";
}

function isActiveOnSelectedDate(player) {
  if (!player.activeDates || !Array.isArray(player.activeDates)) return false;
  return player.activeDates.some((ts) => {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toDateString() === selectedDate.value.toDateString();
  });
}

function getDailyStat(player, field) {
  const key = getDateKey(selectedDate.value);
  return player.dailyStats && player.dailyStats[key]
    ? player.dailyStats[key][field] ?? 0
    : 0;
}

const fetchPlayers = async () => {
  loading.value = true;
  const allSnapshot = await getDocs(collection(db, "players"));
  allPlayers.value = allSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  activePlayers.value = allPlayers.value.filter((player) =>
    isActiveOnSelectedDate(player)
  );
  loading.value = false;
};

const handleDate = (dateStr) => {
  selectedDate.value = new Date(dateStr);
  selectedDateDisplay.value = formatDate(selectedDate.value);
  fetchPlayers();
};

const addPlayer = async (playerData) => {
  await addDoc(collection(db, "players"), {
    ...playerData,
    status: "inactive",
    activeDates: [],
    dailyStats: {},
    createdAt: Timestamp.now(),
  });
  playerForm.value = {
    name: "",
    gender: "",
    matches: 0,
    level: "",
    price: 0,
    status: "inactive",
  };
  showPopup.value = false;
  await fetchPlayers();
};

const updateLevel = async (player, newLevel) => {
  const playerDoc = doc(db, "players", player.id);
  await updateDoc(playerDoc, {
    level: newLevel,
  });
  await fetchPlayers();
};

const updateStatus = async (player, newStatus) => {
  const playerDoc = doc(db, "players", player.id);
  let activeDates = Array.isArray(player.activeDates)
    ? [...player.activeDates]
    : [];
  const selectedTs = Timestamp.fromDate(selectedDate.value);

  let dailyStats = player.dailyStats || {};
  const key = getDateKey(selectedDate.value);
  if (!dailyStats[key]) {
    dailyStats[key] = {
      matches: 0,
      shuttlecock: 0,
      price: 0,
      payment: "not_paid",
      win: 0,
      lose: 0,
    };
  }

  if (newStatus === "active") {
    if (
      !activeDates.some(
        (ts) =>
          (ts.toDate ? ts.toDate() : new Date(ts)).toDateString() ===
          selectedDate.value.toDateString()
      )
    ) {
      activeDates.push(selectedTs);
    }
  } else {
    activeDates = activeDates.filter(
      (ts) =>
        (ts.toDate ? ts.toDate() : new Date(ts)).toDateString() !==
        selectedDate.value.toDateString()
    );
  }

  await updateDoc(playerDoc, {
    activeDates,
    dailyStats,
    status: newStatus,
  });
  await fetchPlayers();
};

const updatePayment = async (player, value) => {
  const playerDoc = doc(db, "players", player.id);
  let dailyStats = player.dailyStats || {};
  const key = getDateKey(selectedDate.value);
  if (!dailyStats[key]) {
    dailyStats[key] = {
      matches: 0,
      price: 0,
      payment: "not_paid",
      win: 0,
      lose: 0,
    };
  }
  dailyStats[key].payment = value;

  await updateDoc(playerDoc, {
    dailyStats,
  });
  await fetchPlayers();
};

onMounted(fetchPlayers);
</script>

<style lang="scss" scoped></style>
