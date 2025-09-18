import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userData: {
      id: null,
      username: null,
      role: null,
    },
    accessToken: null,
    logged_in: false, 
  }),
  actions: {
    logout() {
      this.userData = {
        id: null,
        username: null,
        role: null,
      };
      this.accessToken = null;
      this.logged_in = false;
    },
    setUserData(data) {
      this.userData = data;
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