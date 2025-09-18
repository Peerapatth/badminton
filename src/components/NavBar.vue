<template>
  <nav class="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
    <ul
      class="flex justify-center items-center gap-6 px-3 py-2 rounded-full bg-white shadow-2xl border border-gray-200"
    >
      <li>
        <RouterLink
          to="/players"
          class="flex  items-center justify-center transition-all duration-200"
          :class="{ 'active-icon': $route.path === '/players' }"
        >
          <Players class="w-6 h-6 transition-transform duration-200" />
          <span
            v-if="$route.path === '/players'"
            class="text-xs  text-white font-semibold px-1.5 "
          >
            Players
          </span>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/"
          class="flex  items-center justify-center transition-all duration-200"
          :class="{ 'active-icon': $route.path === '/' }"
        >
          <Matches class="w-6 h-6 p-0.5 transition-transform duration-200" />
          <span
            v-if="$route.path === '/'"
            class="text-xs  text-white font-semibold px-1.5 "
          >
            Matches
          </span>
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/profile"
          class="flex  items-center justify-center transition-all duration-200"
          :class="{ 'active-icon': $route.path === '/profile' }"
        >
          <Profile class="w-6 h-6 transition-transform duration-200" />
          <span
            v-if="$route.path === '/profile'"
            class="text-xs  text-white font-semibold px-1.5 "
          >
            Profile
          </span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink, useRoute } from "vue-router";
import Players from "@/assets/elements/Players.vue";
import Matches from "@/assets/elements/Matches.vue";
import Profile from "@/assets/elements/Profile.vue";

const $route = useRoute();
</script>

<style scoped>
.active-icon {
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: #fff;
  color: white;
  border-radius: 9999px;
  box-shadow: 0 4px 16px 0 #2563eb33;
  padding:6px 8px;
  transform: scale(1.1);
  transition: background 0.2s, transform 0.2s;
}
</style>