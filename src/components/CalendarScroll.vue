<template>
  <div class="calendar-scroll-container">
    <div class="calendar-scroll" ref="calendarScroll">
      <div
        v-for="(day, index) in currentWeek"
        :key="index"
        class="calendar-item"
        :class="{ selected: activeCard === index }"
        @click="selectCard(index)"
      >
        <!-- Calendar Icon mit dynamischer Farbe basierend auf dishSelected -->
        <div class="icon-container">
          <CalendarIcon :class="{ active: day.dishSelected }" class="icon" />
          <!-- Kleines Shopping-List Icon -->
          <ShoppingCartIcon
            :class="['small-icon icon-left', { active: day.shoppingList }]"
          />
          <!-- Kleiner Haken Icon -->
          <CheckIcon
            :class="['small-icon icon-right', { active: day.dishSelected }]"
          />
        </div>
        <div class="day-div">{{ day.name }}</div>
        <div class="date">{{ formatDate(day.date) }}</div>
      </div>
    </div>
  </div>
  <div class="btn-container">
    <button
      v-if="!selectedRecipe"
      :disabled="activeCard === null"
      class="button-primary"
      @click="openModal"
    >
      <div class="btn-content">
        <ClipboardDocumentCheckIcon class="btn-icon" />&nbsp;Rezept
      </div>
    </button>
    <button
      v-else
      :disabled="activeCard === null"
      class="button-error"
      @click="removeRecipeFromDay"
    >
      <div class="btn-content"><TrashIcon class="btn-icon" />&nbsp;Löschen</div>
    </button>
    <button
      :disabled="true"
      class="button-primary"
      style="margin-left: 1rem"
      @click="openModal"
    >
      <div class="btn-content">
        <ShoppingCartIcon class="btn-icon" />&nbsp;Einkaufsliste
      </div>
    </button>
  </div>
  <the-modal
    :isVisible="isModalVisible"
    @close="closeModal"
    title="Rezept wählen"
  >
    <div class="recipe-container">
      <recipe-list @select="onRecipeSelected"></recipe-list>
    </div>

    <!-- Aktionen mit benutzerdefinierten Buttons -->
    <template #actions>
      <button
        class="button-primary"
        :disabled="!currentSelectedRecipe"
        @click="confirm"
      >
        Bestätigen
      </button>
    </template>
  </the-modal>
</template>

<script lang="ts" setup>
import {
  CalendarIcon,
  CheckIcon,
  ShoppingCartIcon,
  ClipboardDocumentCheckIcon,
  TrashIcon,
} from '@heroicons/vue/24/solid'
import TheModal from '@/components/ui/TheModal.vue'
import RecipeList from '@/components/RecipeList.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { formatDate } from '@/assets/utils/dateFormatter'

// Calendar Store nutzen
const calendarStore = useCalendarStore()
const currentWeek = computed(() => calendarStore.currentWeek) // Reaktiver Getter
const selectedRecipe = computed(() => calendarStore.selectedRecipeId)

// Lade die Wochen beim Mounten
onMounted(async () => {
  await calendarStore.fetchWeeks() // Wochen-Daten vom Backend abrufen
  await calendarStore.fetchRecipes() // Rezepte vom Backend abrufen
})

// ----- Modal
const isModalVisible = ref(false)
const currentSelectedRecipe = ref(null)

const openModal = () => {
  isModalVisible.value = true
}

const removeRecipeFromDay = async () => {
  await calendarStore.deleteRecipeFromWeekDay(selectedRecipe.value)
  calendarStore.selectRecipe(null)
}

const closeModal = () => {
  isModalVisible.value = false
}

const confirm = async () => {
  await calendarStore.setRecipeToDay(currentSelectedRecipe.value)
  calendarStore.selectRecipe(currentSelectedRecipe.value)
  closeModal()
}

const onRecipeSelected = (recipeId: string) => {
  // Rezept (id) intern halten
  currentSelectedRecipe.value = recipeId
}
// ----- Modal

// Zustand für die aktive Card
const activeCard = ref(null)

watch(currentWeek, async newWeek => {
  if (Array.isArray(newWeek) && newWeek.length === 0) return // Leere Wochen ignorieren

  calendarStore.selectRecipe(null)
  activeCard.value = null
})

// Methode zum Auswählen einer Card
const selectCard = index => {
  calendarStore.selectedDate = currentWeek.value[index].date
  // recipeId kann auch null sein - Das wollen wir auch. Keine id? Dann zeige auch kein Rezept!
  calendarStore.selectRecipe(currentWeek.value[index].recipeId)
  activeCard.value = index
}
</script>

<style lang="scss">
@use 'sass:color';

.btn-container {
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  .btn-content {
    display: flex;
    justify-content: center;
    align-items: center;

    .btn-icon {
      width: 24px;
      height: 24px;
    }
  }
}

.recipe-container {
  max-height: 300px;
  overflow-y: auto;
}

.calendar-scroll-container {
  overflow-x: auto; /* Ermöglicht horizontales Scrollen */
  white-space: nowrap;
  padding: 0;
}

.calendar-scroll {
  display: flex;
  gap: 20px;
  flex-direction: row;
  box-sizing: border-box;
  min-width: 100%;
  padding: 10px;
  float: left;
}

.calendar-item {
  flex: 1 1 auto;
  display: inline-block;
  text-align: center;
  padding: 10px 5px;
  border-radius: 8px;
  background-color: $secondary-background-color;
  box-shadow: $box-shadow;
  width: 86px; /* Breite des Icons und der Texte */
  height: 132px;

  &.selected {
    background-color: color.adjust(
      $primary-color,
      $lightness: 30%
    ); /* Optische Kennzeichnung der ausgewählten Card */
    border: 2px solid $primary-color;
    box-sizing: border-box;
  }
}

.icon-container {
  position: relative; /* Ermöglicht absolute Positionierung innerhalb des Containers */
  display: inline-block;
  width: 64px;
  height: 64px;
}

.icon {
  width: 64px;
  height: 64px;
  background-color: transparent;
}

.icon.active {
  color: $primary-color; /* Kalender-Icon wird $primary-color, wenn dishSelected true ist */
  background-color: transparent;
}

.small-icon {
  position: absolute; /* Positionierung innerhalb des relativen Containers */
  width: 16px;
  height: 16px;
  top: 50%;
  transform: translateY(-10%);
}

.small-icon.active {
  color: $secondary-color; /* Grün, wenn aktiv */
  background-color: transparent;
}

.icon-left {
  left: 12px;
}

.icon-right {
  right: 12px;
}

.day-div {
  font-size: 13px;
  color: $font-color;
}

.date {
  font-size: 12px;
  color: $secondary-font-color;
}
</style>
