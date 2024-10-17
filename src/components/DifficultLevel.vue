<template>
  <div class="difficult-level">
    <!-- Cake-Icons basierend auf dem Schwierigkeitswert anzeigen -->
    <CakeIcon
      v-for="n in maxLevel"
      :key="n"
      :class="['cake', getCakeColorClass(n)]"
      @click="!readOnly && selectCake(n)"
    />
    <div
      v-if="!readOnly"
      :class="['cake editable-text', getCakeColorClass(value)]"
    >
      {{ getLevelText() }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
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
  readOnly: {
    type: Boolean,
    default: false, // Standardmäßig ist das Control klickbar
  },
})

// Lokale variablen setzen
const value = ref(props.value)

const emit = defineEmits(['difficult-value']) // Event für das Setzen des Werts

// Funktion, um die Farbe der Cakes basierend auf dem Wert zu berechnen
const getCakeColorClass = n => {
  if (value.value >= n) {
    switch (value.value) {
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

// Funktion für den Text hinter den Kuchen - wenn editierbar
const getLevelText = () => {
  switch (value.value) {
    case 1:
      return 'Einfach' // Grün für Level 1
    case 2:
      return 'In Ordnung' // Gelb für Level 2
    case 3:
      return 'Aufwendig' // Orange für Level 3
    case 4:
      return 'Sehr Aufwändig' // Rot für Level 4
    default:
      return ''
  }
}

// Funktion, die ausgelöst wird, wenn der Benutzer einen Cake auswählt
const selectCake = level => {
  value.value = level
  emit('difficult-value', level) // Emitiere den neuen Schwierigkeitswert
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
  padding: 0;
  color: gray; /* Standardmäßig graue Farbe */
  cursor: pointer; /* Zeigt, dass das Icon klickbar ist */
}

.editable-text {
  width: auto;
  vertical-align: bottom;
}

.cake.green {
  color: #27ae60; /* Grün für Level 1 */
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

.cake.gray {
  color: gray; /* Graue Cakes für nicht gewählte Level */
}

.cake[disabled] {
  cursor: not-allowed; /* Zeigt an, dass der Cake nicht klickbar ist, wenn ReadOnly */
}
</style>
