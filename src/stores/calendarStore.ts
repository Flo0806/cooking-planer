// src/stores/calendarStore.js
import { defineStore } from 'pinia'

interface WeekData {
  name: string
  date: Date
  dishSelected: boolean
  shoppingList: boolean
  recipeId?: string
}

interface Recipe {
  id: string // Id des Bildes (GUID)
  image: string // URL zum Bild des Gerichts
  title: string // Titel des Rezepts
  description: string // Beschreibung des Rezepts
  rating: number // Bewertung (z.B. 0 bis 5)
  preparationTime: string // Zubereitungszeit
  category: string // Optional: Kategorie des Gerichts
  difficulty: string // Optional: Schwierigkeitsgrad
}

interface CalendarState {
  weeks: {
    week1: WeekData[]
    week2: WeekData[]
  }
  currentWeekNumber: number
  selectedRecipeId?: string
  recipes: Recipe[]
  selectedDate: Date | undefined
}

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const useCalendarStore = defineStore('calendar', {
  state: (): CalendarState => ({
    weeks: {
      week1: [],
      week2: [],
    },
    currentWeekNumber: 1,
    selectedRecipeId: undefined,
    recipes: [], // Alle bisher geladenen Rezepte
    selectedDate: undefined,
  }),
  getters: {
    // Getter, der basierend auf currentWeekNumber entweder "current" oder "next" zurückgibt
    weekStatus: state => {
      return state.currentWeekNumber === 1 ? 'current' : 'next'
    },
    // Mock-Daten oder API-Aufruf, um eine Woche abzurufen
    currentWeek: state => {
      if (state.currentWeekNumber === 1) {
        return state.weeks.week1
      } else if (state.currentWeekNumber === 2) {
        return state.weeks.week2
      }
    },
  },
  actions: {
    // Holt die aktuelle und nächste Woche mit allen Rezepten und Einkaufslisten ab
    async fetchWeeks() {
      try {
        // Vorher zurücksetzen
        this.weeks.week1 = []
        this.weeks.week2 = []

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/week/weeks`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const [week1, week2] = (await response.json()) as WeekData[][]
        // Wir müssen das Datum (welches durch JSON immer als string ankommt) wieder zu einem Datum machen
        this.weeks.week1 = week1.map(w => ({ ...w, date: new Date(w.date) }))
        this.weeks.week2 = week2.map(w => ({ ...w, date: new Date(w.date) }))
      } catch (error) {
        console.error('Fehler beim Abrufen der Wochen:', error)
      }
    },
    // Hole alle Rezepte
    async fetchRecipes() {
      try {
        this.recipes = []
        const response = await fetch(`${VITE_BACKEND_URL}/recipe/recipes`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const recipes = await response.json()
        this.recipes = recipes // Speichere die Rezepte im Store
      } catch (error) {
        console.error('Fehler beim Abrufen der Rezepte:', error)
      }
    },
    // Setzte die Wochennummer
    setWeek(week: number) {
      week = Math.max(1, Math.min(week, 2))
      this.currentWeekNumber = week
    },
    // Methode zum Setzen des Rezepts, wenn auf eine Card geklickt wird
    selectRecipe(recipeId: string | null) {
      if (!recipeId) {
        this.selectedRecipeId = undefined
        return
      }

      this.selectedRecipeId = recipeId

      // Prüfen, ob das Rezept bereits in der Liste vorhanden ist
      const foundRecipe = this.recipes.find(recipe => recipe.id === recipeId)

      if (!foundRecipe) {
        // Hier wird später der Server-Request eingebaut, um das Rezept zu laden
        console.log(
          `Rezept mit der ID ${recipeId} nicht gefunden. Daten müssen vom Server geholt werden.`,
        )

        // Server-Request, um das Rezept zu holen
        fetch(`${import.meta.env.VITE_BACKEND_URL}/recipe/${recipeId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json() // Rezeptdaten aus dem Server-Response lesen
          })
          .then(recipe => {
            // Rezept dem recipes-Array hinzufügen
            this.recipes.push(recipe)
            console.log(
              `Rezept mit der ID ${recipeId} wurde erfolgreich geladen und hinzugefügt.`,
            )
          })
          .catch(error => {
            console.error('Fehler beim Laden des Rezepts:', error)
          })
      }
    },
  },
})
