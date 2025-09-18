import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userData: {
      id: null,
      username: null,
      name: null,
    },
    accessToken: null,
    logged_in: false, 
  }),
  actions: {
    logout() {
      this.userData = {
        id: null,
        username: null,
        name: null,
      };
      this.accessToken = null;
      this.logged_in = false;
    },
    setUserData(data) {
      this.userData = {
        id: data.id || null,
        username: data.username || null,
        name: data.name || null,
      };
      this.logged_in = true;
    },
    setAccessToken(token) {
      this.accessToken = token;
    },
    getUserData() {
      return this.userData;
    },
    getAccessToken() {
      return this.accessToken;
    },
  },
  persist: true,
});