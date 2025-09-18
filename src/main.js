import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VCalendar from 'v-calendar';
import App from "./App.vue";
import router from "./router";
import "./firebase";
import "./assets/main.css";
import 'v-calendar/style.css';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(VCalendar, {});
app.use(pinia);
app.use(router);
app.mount("#app");