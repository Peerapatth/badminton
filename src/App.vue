<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Landing from "@/layouts/Apps.vue";

const route = useRoute();
const layoutComponent = computed(() =>
  route.name === "login" || route.name === "register" ? "div" : Landing
);
</script>

<style lang="scss" scoped>
</style>