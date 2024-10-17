<template>
  <!-- Backdrop, der hinter dem Menü angezeigt wird -->
  <transition name="fade">
    <div v-if="isOpen" class="menu-backdrop" @click="closeMenu"></div>
  </transition>

  <!-- Das eigentliche Menü mit Slide-In Animation -->
  <transition name="slide">
    <nav v-if="isOpen" class="menu">
      <button class="menu-button" @click="onClick('home')">Übersicht</button>
      <button class="menu-button" @click="onClick('recipes')">Rezepte</button>
    </nav>
  </transition>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter() // Nutze Router

const emit = defineEmits(['close'])
defineProps({
  isOpen: Boolean,
})

// Menü schließen und "close" Event emitten
const closeMenu = () => {
  emit('close')
}

// Klick-Event-Handler für Buttons
const onClick = (label: string) => {
  router.push({ name: label })
  closeMenu() // Menü nach Klick schließen
}
</script>

<style lang="scss" scoped>
/* Backdrop hinter dem Menü */
.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Halbtransparentes Schwarz */
  z-index: 999;
}

/* Das eigentliche Menü */
.menu {
  display: flex;
  flex-direction: column;
  width: 250px;
  gap: 20px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background-color: $header-background-color;
  z-index: 1000;
  padding: 20px;
}

/* Transitionen für Menü-Animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Transition für den Backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.menu-button {
  background-color: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: white;
  padding: 10px;
  transition:
    color 0.3s ease,
    background-color 0.3s ease;
}

/* Effekte bei Hover oder Klick */
.menu-button:hover {
  color: $primary-color; /* Primärfarbe aus den Variablen */
}

.menu-button:active {
  background-color: rgba(0, 0, 0, 0.1); /* Leichter Hintergrund beim Klicken */
}

.menu-button:focus {
  outline: none;
}
</style>
