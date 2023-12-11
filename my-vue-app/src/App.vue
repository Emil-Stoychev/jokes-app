<script setup>
import Navigation from "./components/core/navigation.vue";
import MyFooter from "./components/core/myfooter.vue";
import useAuthStore from "./store/authStore";
import { ref } from "vue";

const authStore = useAuthStore()
let isArrowShow = ref(false)
window.addEventListener('scroll', async () => {
  const scrollY = window.scrollY || window.pageYOffset;

  if (scrollY >= 700 && !isArrowShow.value) {
    isArrowShow.value = true
  } else if (scrollY <= 700 && isArrowShow.value) {
    isArrowShow.value = false
  }
});

function goUp() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
  <div :class="authStore.isLoading ? 'overlayShow' : 'overylayNone'"></div>
  <Navigation />

  <main class="main">
    <router-view />

    <img v-if="isArrowShow" @click="goUp" class="arrowUp" src="/images/arrowUp.gif" />
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

/* ARROW UP */

.arrowUp {
  position: fixed;
  right: 0;
  bottom: 0;
  cursor: pointer;
  width: 150px;
  opacity: 0.7;
  z-index: 100;
}

.main {
  margin: 0 auto;
  min-height: 100vh;
}
</style>
