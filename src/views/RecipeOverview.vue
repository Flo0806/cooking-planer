<template>
  <the-card :type="CardType.HIGHLIGHT">
    <!-- Header mit Button und Suchfeld -->
    <div class="header">
      <button class="add-recipe-button" @click="addRecipe">
        <PlusIcon></PlusIcon>
      </button>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Rezept suchen..."
        class="search-input"
      />
    </div>

    <!-- Rezeptliste -->
    <div class="recipe-list">
      <the-card
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :type="CardType.MENU"
      >
        <div style="display: flex">
          <div class="recipe-image">
            <!-- Bild des Rezepts, mit Ladeanimation bis geladen -->
            <img
              v-if="recipe.image"
              :src="recipe.image"
              alt="Recipe Image"
              @load="imageLoaded(recipe.id)"
              v-show="!loadingImages[recipe.id]"
            />
            <div
              v-else
              class="loading-spinner"
              v-show="loadingImages[recipe.id]"
            >
              <!-- CSS Ladekringel -->
            </div>
          </div>

          <div class="recipe-details">
            <h3>{{ recipe.title }}</h3>
            <div class="recipe-meta">
              <!-- StarRating Komponente -->
              <StarRating :value="recipe.rating" />
              <!-- DifficultLevel Komponente -->
              <DifficultLevel :value="recipe.difficulty" />
            </div>
          </div>
        </div>
      </the-card>
    </div>
  </the-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import TheCard from '../components/TheCard.vue'
import { CardType } from '../assets/utils/cardTypes'
import StarRating from '../components/StarRating.vue' // Importiere StarRating-Komponente
import DifficultLevel from '../components/DifficultLevel.vue' // Importiere DifficultLevel-Komponente
import { PlusIcon } from '@heroicons/vue/24/solid' // Heroicons Cake-Icon importieren

// Rezept-Daten
const recipes = ref([
  {
    id: '1',
    title: 'Spaghetti Bolognese',
    image: '', // Asynchron laden
    rating: 4.5,
    difficulty: 2,
  },
  {
    id: '2',
    title: 'Caesar Salad',
    image: '',
    rating: 4,
    difficulty: 0,
  },
  {
    id: '2',
    title: 'Caesar Salad',
    image: '',
    rating: 4,
    difficulty: 1,
  },
  {
    id: '2',
    title: 'Caesar Salad',
    image: '',
    rating: 4,
    difficulty: 1,
  },
  {
    id: '2',
    title: 'Caesar Salad',
    image: '',
    rating: 4,
    difficulty: 3,
  },
])

// Zustand für das Suchfeld
const searchQuery = ref('')

// Ladezustand der Bilder
const loadingImages = ref<{ [key: string]: boolean }>({})

// Filtierte Rezepte basierend auf Suchfeld
const filteredRecipes = computed(() =>
  recipes.value.filter(recipe => {
    loadingImages.value[recipe.id] = true
    return recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  }),
)

// Funktion zum Hinzufügen eines neuen Rezepts
const addRecipe = () => {
  console.log('Neues Rezept hinzufügen')
}

// Bild wird geladen
const imageLoaded = (id: string) => {
  loadingImages.value[id] = false // Ladeanimation stoppen
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
}

.add-recipe-button {
  background-color: $primary-color;
  color: $inverse-font-color;
  padding: 5px 20px;
  height: 37px;
  margin-right: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  transition: background-color 0.3s ease;

  * {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background-color: darken($primary-color, 10%);
  }
}

.search-input {
  padding: 10px;
  border: 1px solid $input-border-color;
  border-radius: $border-radius;
  width: 100%;
  max-width: 300px;
}

.recipe-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recipe-image {
  width: 100px;
  height: 100px;
  background-color: #f0f0f0;
  border-radius: $border-radius;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.recipe-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: auto;
}

.recipe-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
