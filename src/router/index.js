import { createRouter, createWebHistory } from "vue-router";
import Main from "@/pages/index.vue";
import Profile from "@/pages/Profile.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  {
    path: "/",
    name: "home",
    component: Main,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    if (!authStore.logged_in) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;