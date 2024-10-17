<template>
  <div class="difficult-level">
    <!-- Cake-Icons basierend auf dem Schwierigkeitswert anzeigen -->
    <CakeIcon
      v-for="n in maxLevel"
      :key="n"
      :class="['cake', getCakeColorClass(n)]"
    />
  </div>
</template>

<script lang="ts" setup>
import { CakeIcon } from '@heroicons/vue/24/solid' // Heroicons Cake-Icon importieren

// Props
const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: val => val >= 1 && val <= 4, // Limitiere auf 1 bis 4
  },
  maxLevel: {
    type: Number,
    default: 4, // Die maximale Anzahl der Cakes (Schwierigkeitsstufen)
  },
})

// Funktion, um die Farbe der Cakes basierend auf dem Wert zu berechnen
const getCakeColorClass = n => {
  if (props.value >= n) {
    switch (props.value) {
      case 1:
        return 'green' // Grün für Level 1
      case 2:
        return 'yellow' // Gelb für Level 2
      case 3:
        return 'orange' // Orange für Level 3
      case 4:
        return 'red' // Rot für Level 4
      default:
        return ''
    }
  } else {
    return 'gray' // Graue Cakes für nicht gewählte Level
  }
}
</script>

<style lang="scss">
.difficult-level {
  display: flex;
  gap: 8px; /* Abstand zwischen den Icons */
}

.cake {
  width: 24px;
  height: 24px;
  color: gray; /* Standardmäßig graue Farbe */
}

.cake.green {
  color: #2ecc71; /* Grün für Level 1 */
}

.cake.yellow {
  color: #f1c40f; /* Gelb für Level 2 */
}

.cake.orange {
  color: #e67e22; /* Orange für Level 3 */
}

.cake.red {
  color: #e74c3c; /* Rot für Level 4 */
}
</style>
