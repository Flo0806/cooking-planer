<template>
  <div class="recipe-list">
    <!-- Iteriere über die Rezepte und stelle jedes als Listenelement dar -->
    <div
      v-for="recipe in recipes"
      :key="recipe.id"
      :class="['recipe-item', { selected: selectedRecipeId === recipe.id }]"
      @click="selectRecipe(recipe.id)"
    >
      <h3 class="recipe-title">{{ recipe.title }}</h3>
      <div class="recipe-meta">
        <!-- StarRating Komponente -->
        <star-rating :value="recipe.rating" :readable="true"></star-rating>
        <!-- DifficultLevel Komponente -->
        <difficult-level
          :value="recipe.difficulty"
          :readOnly="true"
        ></difficult-level>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import StarRating from './StarRating.vue'
import DifficultLevel from './DifficultLevel.vue'

// Store importieren
const calendarStore = useCalendarStore()

// Events
const emit = defineEmits(['select'])

// Berechne die Rezepte aus dem Store
const recipes = computed(() => calendarStore.recipes)

// Zustand für das aktuell ausgewählte Rezept
const selectedRecipeId = ref<string | null>(null)

// Funktion zum Auswählen eines Rezepts
const selectRecipe = (id: string) => {
  selectedRecipeId.value = id
  // Event auslösen, wenn sich die Selektion ändert
  emit('select', id)
}
</script>

<style scoped lang="scss">
@use 'sass:color';

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recipe-item {
  box-sizing: border-box;
  padding: 10px;
  background-color: $secondary-background-color;
  border-bottom: solid 1px lightgray;

  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    border-radius: $border-radius;
    border-bottom-color: transparent;
    background-color: color.adjust(
      $secondary-background-color,
      $lightness: -10%
    );
  }

  &.selected {
    border-radius: $border-radius;
    border-bottom-color: transparent;
    background-color: $tertiary-color;
    color: $inverse-font-color;
  }
}

.recipe-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: inherit;
}

.recipe-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
