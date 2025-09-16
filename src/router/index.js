import { createRouter, createWebHistory } from "vue-router";
import Main from "@/pages/index.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: Main,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;