<script setup>
import Navigation from "./components/core/navigation.vue";
import MyFooter from "./components/core/myfooter.vue";
import useAuthStore from "./store/authStore";

const authStore = useAuthStore()
</script>

<template>
  <div :class="authStore.isLoading ? 'overlayShow' : 'overylayNone'"></div>
  <Navigation />

  <main class="main">
    <router-view />
  </main>

  <MyFooter />
</template>

<style scoped>
/* OVERLAY */
.overlayNone {
  display: none;
}

.overlayShow {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 0;
}

.main {
  margin: 0 auto;
  min-height: 100vh;
}
</style>
