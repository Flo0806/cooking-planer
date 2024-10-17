<template>
  <div class="week-toggle">
    <button
      :class="[
        'toggle-button',
        { active: calendarStore.weekStatus === 'current' },
      ]"
      @click="selectWeek(1)"
    >
      Diese Woche
    </button>
    <button
      :class="[
        'toggle-button',
        { active: calendarStore.weekStatus === 'next' },
      ]"
      @click="selectWeek(2)"
    >
      Nächste Woche
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useCalendarStore } from '@/stores/calendarStore'

// Calendar Store nutzen
const calendarStore = useCalendarStore()

// Methode zum Umschalten zwischen den Wochen
const selectWeek = (week: number) => {
  calendarStore.setWeek(week)
}
</script>

<style lang="scss">
.week-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.toggle-button {
  background-color: $secondary-background-color;
  border: 1px solid $primary-color;
  padding: 10px 20px;
  font-size: 16px;
  width: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 20px; /* Border-Radius für die äußeren Ecken */
}

.toggle-button:first-child {
  border-radius: 20px 0 0 20px; /* Nur linke Ecken abgerundet */
}

.toggle-button:last-child {
  border-radius: 0 20px 20px 0; /* Nur rechte Ecken abgerundet */
}

.active {
  background-color: $primary-color;
  color: white;
}

.toggle-button:not(.active):hover {
  background-color: lighten($primary-color, 40%);
}
</style>
