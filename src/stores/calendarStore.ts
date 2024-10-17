// src/stores/calendarStore.js
import { defineStore } from 'pinia'

//#region Mockdaten
const recipes: Recipe[] = [
  {
    id: 'c9d6b33f-9127-4dbf-9b3c-7c61065ddc42',
    image: 'https://example.com/spaghetti.jpg',
    title: 'Spaghetti Carbonara',
    description:
      'Ein klassisches italienisches Pasta-Gericht mit Eiern, Käse, Speck und Pfeffer.',
    rating: 4.5,
    preparationTime: '25 Minuten',
    category: 'Hauptgericht',
    difficulty: 'leicht',
  },
  {
    id: 'f47b9ef8-4e5b-4b82-85cf-9dcb097c02a8',
    image:
      'https://img.chefkoch-cdn.de/rezepte/1205621226313744/bilder/1508311/crop-642x428/amerikanische-pancakes.jpg',
    title: 'Fluffige Pancakes',
    description:
      'Diese Pancakes sind leicht und fluffig, perfekt für ein gemütliches Frühstück.',
    rating: 4.7,
    preparationTime: '15 Minuten',
    category: 'Frühstück',
    difficulty: 'leicht',
  },
  {
    id: '27c7c890-ec4f-4703-9dfd-1a4f3d96ab79',
    image: 'https://example.com/chocolate-cake.jpg',
    title: 'Schokoladenkuchen',
    description:
      'Ein reichhaltiger und saftiger Schokoladenkuchen, perfekt für jeden Anlass.',
    rating: 4.9,
    preparationTime: '50 Minuten',
    category: 'Dessert',
    difficulty: 'mittel',
  },
]

//#endregion

interface WeekData {
  name: string
  date: string
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
}

export const useCalendarStore = defineStore('calendar', {
  state: (): CalendarState => ({
    weeks: {
      week1: [
        {
          name: 'Montag',
          date: '01.01.2024',
          dishSelected: false,
          shoppingList: false,
        },
        {
          name: 'Dienstag',
          date: '02.01.2024',
          dishSelected: true,
          shoppingList: false,
          recipeId: 'f47b9ef8-4e5b-4b82-85cf-9dcb097c02a8',
        },
        {
          name: 'Mittwoch',
          date: '03.01.2024',
          dishSelected: true,
          shoppingList: true,
        },
        {
          name: 'Donnerstag',
          date: '04.01.2024',
          dishSelected: false,
          shoppingList: false,
        },
        {
          name: 'Freitag',
          date: '05.01.2024',
          dishSelected: false,
          shoppingList: false,
        },
        {
          name: 'Samstag',
          date: '06.01.2024',
          dishSelected: false,
          shoppingList: false,
        },
        {
          name: 'Sonntag',
          date: '07.01.2024',
          dishSelected: false,
          shoppingList: false,
        },
      ],
      week2: [
        {
          name: 'Montag',
          date: '08.01.2024',
          dishSelected: false,
          shoppingList: false,
        },
        {
          name: 'Dienstag',
          date: '09.01.2024',
          dishSelected: false,
          shoppingList: false,
        },
        {
          name: 'Mittwoch',
          date: '10.01.2024',
          dishSelected: false,
          shoppingList: false,
        },
        {
          name: 'Donnerstag',
          date: '11.01.2024',
          dishSelected: true,
          shoppingList: false,
        },
        {
          name: 'Freitag',
          date: '12.01.2024',
          dishSelected: false,
          shoppingList: false,
        },
        {
          name: 'Samstag',
          date: '13.01.2024',
          dishSelected: true,
          shoppingList: true,
        },
        {
          name: 'Sonntag',
          date: '14.01.2024',
          dishSelected: false,
          shoppingList: false,
        },
      ],
    },
    currentWeekNumber: 1,
    selectedRecipeId: undefined,
    recipes: recipes, // [], // Alle bisher geladenen Rezepte
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
    // Setzte die Wochennummer
    setWeek(week: number) {
      week = Math.max(1, Math.min(week, 2))
      this.currentWeekNumber = week
    },
    getWeeks() {
      // Später über Rest
    },
    // Methode zum Setzen des Rezepts, wenn auf eine Card geklickt wird
    selectRecipe(recipeId: string) {
      this.selectedRecipeId = recipeId

      // Prüfen, ob das Rezept bereits in der Liste vorhanden ist
      const foundRecipe = this.recipes.find(recipe => recipe.id === recipeId)

      if (!foundRecipe) {
        // Hier wird später der Server-Request eingebaut, um das Rezept zu laden
        console.log(
          `Rezept mit der ID ${recipeId} nicht gefunden. Daten müssen vom Server geholt werden.`,
        )
      }
    },
  },
})
