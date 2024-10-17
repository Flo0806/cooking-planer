<script setup lang="ts">
import CalendarScroll from './CalendarScroll.vue'
import WeekToggle from './WeekToggle.vue'
import TheCard from './TheCard.vue'
import RecipeCard from './RecipeCard.vue'
import { CardType } from '../assets/utils/cardTypes'
</script>

<template>
  <div>
    <the-card :type="CardType.MENU">
      <week-toggle></week-toggle>
      <calendar-scroll></calendar-scroll>
    </the-card>
    <recipe-card></recipe-card>
  </div>
</template>
