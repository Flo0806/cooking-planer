<template>
  <TheCard v-if="selectedRecipe" style="margin-top: 1rem">
    <div class="recipe-card">
      <img :src="selectedRecipe.image" alt="Rezept Bild" class="recipe-image" />
      <div class="recipe-details">
        <h2 class="recipe-title">{{ selectedRecipe.title }}</h2>
        <p class="recipe-description">{{ selectedRecipe.description }}</p>
        <p class="recipe-time">
          Zubereitungszeit: {{ selectedRecipe.preparationTime }}
        </p>
        <p class="recipe-category">Kategorie: {{ selectedRecipe.category }}</p>
      </div>
      <div class="info">
        <star-rating :value="4.4"></star-rating>
        <difficult-level :value="3"></difficult-level>
      </div>
    </div>
  </TheCard>
</template>

<script setup lang="ts">
import TheCard from './TheCard.vue'
import StarRating from './StarRating.vue'
import DifficultLevel from './DifficultLevel.vue'
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore' // Store importieren

// Store instanzieren
const calendarStore = useCalendarStore()

// Berechne das ausgewählte Rezept basierend auf der selectedRecipeId
const selectedRecipe = computed(() => {
  return calendarStore.selectedRecipeId
    ? calendarStore.recipes.find(
        recipe => recipe.id === calendarStore.selectedRecipeId,
      )
    : null
})
</script>

<style lang="scss">
.recipe-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.recipe-image {
  width: 100%;
  height: auto;
  max-width: 300px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 2px solid $primary-color; /* Primärfarbe als Rahmen */
}

.info {
  margin-top: 1rem;
  display: flex;
  gap: 20px;
}

.recipe-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.recipe-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: $font-color; /* Standard-Schriftfarbe */
}

.recipe-description {
  font-size: 1rem;
  margin-bottom: 10px;
  color: $font-color; /* Standard-Schriftfarbe */
}

.recipe-time,
.recipe-category {
  font-size: 0.9rem;
  color: $secondary-font-color; /* Sekundäre Schriftfarbe */
  margin-bottom: 5px;
}

/* Responsive Styling für Mobile und Desktop */
@media (min-width: 768px) {
  .recipe-card {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    background-color: $secondary-background-color; /* Sekundäre Hintergrundfarbe */
  }

  .recipe-image {
    max-width: 400px;
    margin-right: 20px;
  }

  .recipe-details {
    align-items: flex-start;
  }

  .recipe-title {
    font-size: 2rem;
    color: $font-color; /* Standard-Schriftfarbe */
  }

  .recipe-description {
    font-size: 1.2rem;
    color: $font-color; /* Standard-Schriftfarbe */
  }

  .recipe-time,
  .recipe-category {
    font-size: 1rem;
    color: $secondary-font-color; /* Sekundäre Schriftfarbe */
  }
}
</style>
