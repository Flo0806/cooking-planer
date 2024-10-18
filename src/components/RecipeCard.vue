<template>
  <TheCard v-if="selectedRecipe" style="margin-top: 1rem">
    <div class="outer-container">
      <h2 class="date-title">{{ formatDate(currentDate, true) }}</h2>
      <div class="recipe-card">
        <img
          v-if="selectedRecipe.image"
          @load="onImageLoaded"
          :src="`${VITE_BACKEND_URL}/uploads/${selectedRecipe.image}`"
          alt="Rezept Bild"
          class="recipe-image"
        />
        <div v-else class="no-image">Kein Bild</div>
        <div v-show="selectedRecipe.image && loading" class="loading-spinner" />
        <div class="recipe-details">
          <h2 class="recipe-title">{{ selectedRecipe.title }}</h2>
          <p class="recipe-description">{{ selectedRecipe.description }}</p>
          <p class="recipe-time">
            Zubereitungszeit: {{ selectedRecipe.preparationTime }}
          </p>
          <p class="recipe-category">
            Kategorie: {{ selectedRecipe.category }}
          </p>
        </div>
      </div>
      <div class="info">
        <star-rating
          :value="selectedRecipe.rating"
          :readable="true"
        ></star-rating>
        <difficult-level
          :value="selectedRecipe.difficulty"
          :readOnly="true"
        ></difficult-level>
      </div>
    </div>
  </TheCard>
</template>

<script setup lang="ts">
import TheCard from './TheCard.vue'
import StarRating from './StarRating.vue'
import DifficultLevel from './DifficultLevel.vue'
import { computed, ref } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore' // Store importieren
import { formatDate } from '@/assets/utils/dateFormatter'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Store instanzieren
const calendarStore = useCalendarStore()

const loading = ref(true)

// Selektiertes Datum
const currentDate = computed(() => {
  return calendarStore.selectedDate
})

// Berechne das ausgewählte Rezept basierend auf der selectedRecipeId
const selectedRecipe = computed(() => {
  return calendarStore.selectedRecipeId
    ? calendarStore.recipes.find(
        recipe => recipe.id === calendarStore.selectedRecipeId,
      )
    : null
})

const onImageLoaded = () => {
  console.log('RESET loading')
  loading.value = false
}
</script>

<style lang="scss">
.outer-container {
  display: flex;
  align-items: center;
  text-align: center;
  position: relative;
  flex-direction: column;
  box-sizing: border-box;

  .date-title {
    color: $primary-color;
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
}

.recipe-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
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

/* Ladeanimation */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.no-image {
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
  font-size: 11;
  width: 100%;
  height: 200px;
  border: 2px solid $primary-color; /* Primärfarbe als Rahmen */
  border-radius: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Styling für Mobile und Desktop */
@media (min-width: 768px) {
  .recipe-card {
    flex-direction: row;
    align-items: flex-start;
    text-align: left;
    background-color: $secondary-background-color; /* Sekundäre Hintergrundfarbe */
    padding-top: 50px; /* Platz für den Titel oben freihalten */
  }

  .recipe-image {
    max-width: 300px;
    margin-right: 20px;
  }

  .recipe-details {
    align-items: flex-start;
  }

  .no-image {
    max-width: 300px;
    margin-right: 20px;
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
