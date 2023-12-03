<script setup>
import Navigation from "./components/core/navigation.vue";
import MyFooter from "./components/core/myfooter.vue";
</script>

<template>
  <Navigation />

  <main class="main">
    <router-view />
  </main>
  
  <MyFooter />
</template>

<style scoped>

.main {
  margin: 0 auto;
  min-height: 100vh;
}


</style>
