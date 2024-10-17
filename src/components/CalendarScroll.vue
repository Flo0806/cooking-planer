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
        <div class="day">{{ day.name }}</div>
        <div class="date">{{ day.date }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  CalendarIcon,
  CheckIcon,
  ShoppingCartIcon,
} from '@heroicons/vue/24/solid'
import { onMounted } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'

// Calendar Store nutzen
const calendarStore = useCalendarStore()
const currentWeek = computed(() => calendarStore.currentWeek) // Reaktiver Getter

// Beispielhaft holen wir Woche 1 (später dynamisch)
onMounted(() => {})

// Events

// Zustand für die aktive Card
const activeCard = ref(null)
// Methode zum Auswählen einer Card
const selectCard = index => {
  if (currentWeek.value[index].recipeId) {
    calendarStore.selectRecipe(currentWeek.value[index].recipeId)
  }
  activeCard.value = index
}
</script>

<style lang="scss">
@use 'sass:color';

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
  padding: 10px;
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

.day {
  font-size: 14px;
  color: $font-color;
}

.date {
  font-size: 12px;
  color: $secondary-font-color;
}
</style>
