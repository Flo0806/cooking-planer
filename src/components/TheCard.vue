<template>
  <div :style="{ backgroundColor: getBackgroundColor }" class="card">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue' // Import von computed
import { CardType } from '../assets/utils/cardTypes' // Importiere das Enum

// Prop für den Kartentyp
const props = defineProps({
  type: {
    type: String,
    default: CardType.STANDARD, // Standardtyp ist 'standard'
  },
})

// Bestimme die Hintergrundfarbe basierend auf dem Kartentyp
const getBackgroundColor = computed(() => {
  switch (props.type) {
    case CardType.MENU:
      return '#102635' // Hintergrund für 'Menu'
    case CardType.HIGHLIGHT:
      return '#f0f0f5' // Hintergrund für 'Highlight'
    default:
      return '#ffffff' // Standard-Hintergrundfarbe
  }
})
</script>

<style lang="scss">
.card {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
