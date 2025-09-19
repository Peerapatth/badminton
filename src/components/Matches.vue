<template>
  <div>
    <h2>Matches History</h2>
    <ul>
      <li v-for="match in matches" :key="match.id">
        <strong>{{ match.date }}</strong> &mdash;
        <span v-for="(team, idx) in match.teams" :key="idx">
          <span>
            {{ team.players.map((pid) => playerNames[pid] || pid).join(" & ") }}
            <span v-if="idx === 0"> vs </span>
          </span>
        </span>
        <span>
          ({{ match.teams[0].result === "win" ? "Win" : "Lose" }} /
          {{ match.teams[1].result === "lose" ? "Lose" : "Win" }})
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
h2 {
  margin-bottom: 1rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
}
</style>