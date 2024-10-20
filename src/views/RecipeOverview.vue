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
        style="cursor: pointer"
        @click="goToRecipe(recipe.id)"
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        :type="CardType.MENU"
      >
        <div style="display: flex">
          <div class="recipe-image">
            <!-- Bild des Rezepts, mit Ladeanimation bis geladen -->
            <img
              v-if="recipe.image"
              :src="`${VITE_BACKEND_URL}/uploads/${recipe.image}`"
              alt="Recipe Image"
              @load="imageLoaded(recipe.id)"
              v-show="!loadingImages[recipe.id]"
            />
            <div v-else class="no-image">Kein Bild</div>
            <div
              class="loading-spinner"
              v-show="recipe.image && loadingImages[recipe.id]"
            >
              <!-- CSS Ladekringel -->
            </div>
          </div>

          <div class="recipe-details">
            <h3>{{ recipe.title }}</h3>
            <div class="recipe-meta">
              <!-- StarRating Komponente -->
              <StarRating :value="recipe.rating" :readable="true" />
              <!-- DifficultLevel Komponente -->
              <DifficultLevel :value="recipe.difficulty" :readable="true" />
            </div>
          </div>
        </div>
      </the-card>
    </div>
  </the-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TheCard from '../components/TheCard.vue'
import { CardType } from '../assets/utils/cardTypes'
import StarRating from '../components/StarRating.vue' // Importiere StarRating-Komponente
import DifficultLevel from '../components/DifficultLevel.vue' // Importiere DifficultLevel-Komponente
import { PlusIcon } from '@heroicons/vue/24/solid' // Heroicons Cake-Icon importieren
import { useCalendarStore } from '@/stores/calendarStore'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Store und Router nutzen
const calendarStore = useCalendarStore()
const router = useRouter() // Router initialisieren

// Rezept-Daten
const recipes = computed(() => calendarStore.recipes)

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
  router.push({ name: 'recipe', params: { id: 'new' } })
}

// Bild wird geladen
const imageLoaded = (id: string) => {
  loadingImages.value[id] = false // Ladeanimation stoppen
}

// Rezepte laden, wenn die Komponente geladen wird
onMounted(async () => {
  await calendarStore.fetchRecipes() // Rezepte vom Backend abrufen
  // Ladezustand für alle Rezepte initialisieren
  recipes.value.forEach(recipe => {
    loadingImages.value[recipe.id] = true
  })
})

// Funktion zur Navigation zur Rezept-Detailseite
const goToRecipe = (id: string) => {
  router.push({ name: 'recipe', params: { id } })
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

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
  height: 42px;
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
    background-color: color.adjust($primary-color, $lightness: -10%);
  }
}

.no-image {
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
  font-size: 11;
  width: 100%;
  height: 100%;
  flex: 1;
  overflow: hidden;
}

.search-input {
  font-family: inherit;
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
  min-width: 100px;
  background-color: #f0f0f0;
  border-radius: $border-radius;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  border: 2px solid $primary-color; /* Primärfarbe als Rahmen */
  border-radius: 8px;

  > img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
}

.recipe-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0; /* Wichtig für Flexbox, damit der Text abgeschnitten werden kann */

  h3 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1; /* Der Text kann bei Bedarf schrumpfen */
    max-width: 100%; /* Stellt sicher, dass der Text nicht über das Container hinausgeht */
  }
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

/* Desktop-spezifische Anpassungen */
@media (min-width: 1024px) {
  .recipe-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    padding: 20px;
  }

  .recipe-image {
    width: 150px;
    height: 150px;
  }

  .recipe-details {
    h3 {
      font-size: 1.5rem; /* Größere Schriftgröße für den Titel */
    }

    .recipe-meta {
      gap: 15px; /* Größerer Abstand zwischen den Meta-Daten */
    }
  }

  .search-input {
    width: 100%;
    max-width: 500px; /* Größeres Suchfeld für Desktop */
    font-size: 1.2rem;
  }

  .add-recipe-button {
    padding: 10px 30px;
    font-size: 1.2rem;
    height: 50px;
  }
}
</style>
