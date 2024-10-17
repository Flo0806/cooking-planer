<template>
  <header class="app-header">
    <div class="header-left">
      <!-- Menü-Button -->
      <Bars3Icon class="icon" @click="toggleMenu" />
      <h1 class="app-title">Cooking Planner</h1>
    </div>
    <div class="header-right">
      <MagnifyingGlassIcon class="icon" />
      <BellIcon class="icon" />
    </div>
  </header>

  <!-- Integriertes Menu.vue -->
  <HeaderMenu :is-open="isOpen" @close="toggleMenu" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
} from '@heroicons/vue/24/solid'
import HeaderMenu from './HeaderMenu.vue' // Importiere die Menu-Komponente

// Zustand des Menüs
const isOpen = ref(false)

// Menü öffnen/schließen
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style lang="scss">
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $header-background-color;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  color: $header-font-color;
  padding: 10px 20px;
  z-index: 10;

  .header-left {
    display: flex;
    align-items: center;

    .app-title {
      font-size: 24px;
      margin-left: 10px;
    }
  }

  .header-right {
    display: flex;
    gap: 15px;
  }

  .icon {
    width: 24px;
    height: 24px;
    color: $primary-color;
    cursor: pointer;

    &:hover {
      color: $secondary-color;
    }
  }
}
</style>
