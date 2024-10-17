<template>
  <div class="rating-control">
    <!-- Sterndarstellung für den Wert -->
    <span
      v-for="n in maxStars"
      :key="n"
      class="star"
      @click="!readable ? updateRating(n) : null"
      @mousemove="!readable ? setHover(n) : null"
      @mouseleave="!readable ? clearHover() : null"
    >
      <svg
        :class="{
          filled: isStarFilled(n),
          readonly: readable,
        }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="star-icon"
      >
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  maxStars: {
    type: Number,
    default: 5,
  },
  readable: {
    type: Boolean,
    default: false,
  },
})

// Lokale reaktive Variablen
const rating = ref(props.value)
const hoverRating = ref(0)

// Methode zum Setzen des Hover-Werts
const setHover = (star: number) => {
  hoverRating.value = star
}

// Methode zum Zurücksetzen des Hover-Werts
const clearHover = () => {
  hoverRating.value = 0
}

// Methode zum Aktualisieren der Bewertung (nur wenn nicht im "readable" Modus)
const updateRating = (star: number) => {
  rating.value = star
}

// Berechnung, ob ein Stern voll gefüllt ist
const isStarFilled = (star: number) => {
  const currentRating = +hoverRating.value || +rating.value
  return star <= Math.round(currentRating)
}
</script>

<style lang="scss">
.rating-control {
  display: flex;
  align-items: center;
}

.star {
  cursor: pointer;
  margin-right: 5px;
}

.star-icon {
  width: 24px;
  height: 24px;
  color: #ccc; /* Graue Sterne als Standard */
}

.star-icon.filled {
  color: $primary-color; /* Primärfarbe für volle Sterne */
}

.star-icon.half::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: $primary-color; /* Halber Stern */
  z-index: 1;
}

.star-icon.readonly {
  cursor: default;
}
</style>
