import { createRouter, createWebHistory } from "vue-router";
import Main from "@/pages/index.vue";
import Players from "@/pages/Players.vue";
import Profile from "@/pages/Profile.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Main,
  },
  {
    path: "/players",
    name: "players",
    component: Players,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;