<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/ui/TheHeader.vue'
</script>

<template>
  <the-header></the-header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
