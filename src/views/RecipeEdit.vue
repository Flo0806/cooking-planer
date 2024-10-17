<template>
  <div class="recipe-create">
    <!-- Bildplatzhalter mit Vorschau -->
    <TheCard class="image-card">
      <div class="image-upload">
        <img
          v-if="imagePreview"
          :src="imagePreview"
          alt="Image Preview"
          class="image-preview"
        />
        <div v-else class="image-placeholder">Bild hier hochladen</div>
      </div>
      <!-- Bild-Upload-Komponente -->
      <UploadImage @file-selected="onFileSelected" />
    </TheCard>

    <!-- Textfelder für Rezeptname, Beschreibung, Kategorie, Dauer -->
    <TheCard class="form-card">
      <!-- Rezeptname -->
      <input
        @blur="validateInput('title')"
        v-model.trim="recipeTitle"
        type="text"
        placeholder="Rezeptname"
        :class="['text-input', { invalid: titleValidity === 'invalid' }]"
      />

      <!-- Rezeptbeschreibung -->
      <textarea
        @blur="validateInput('description')"
        v-model.trim="recipeDescription"
        placeholder="Rezeptbeschreibung"
        :class="[
          'textarea-input',
          { invalid: descriptionValidity === 'invalid' },
        ]"
      ></textarea>

      <!-- Kategorie -->
      <input
        @blur="validateInput('category')"
        v-model.trim="recipeCategory"
        type="text"
        placeholder="Kategorie"
        :class="['text-input', { invalid: categoryValidity === 'invalid' }]"
      />

      <!-- Dauer (Minuten) -->
      <input
        @blur="validateInput('preparationTime')"
        v-model.number="preparationTime"
        type="number"
        placeholder="Dauer (Minuten)"
        min="1"
        :class="['text-input', { invalid: durationValidity === 'invalid' }]"
      />

      <!-- Rating und Schwierigkeit -->
      <star-rating
        :class="{ invalid: ratingValidity === 'invalid' }"
        :value="0"
        @rating-value="onRatingUpdated"
      ></star-rating>
      <difficult-level
        @difficult-value="onDifficultUpdated"
        :value="1"
      ></difficult-level>
    </TheCard>

    <!-- Speichern-Button -->
    <button :disabled="!formValid()" class="save-button" @click="saveRecipe">
      Speichern
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TheCard from '../components/TheCard.vue'
import UploadImage from '../components/UploadImage.vue'
import StarRating from '../components/StarRating.vue'
import DifficultLevel from '../components/DifficultLevel.vue'

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // Zugriff auf die Umgebungsvariable

const recipeTitle = ref('') // Rezeptname
const recipeDescription = ref('') // Rezeptbeschreibung
const recipeCategory = ref('') // Kategorie
const preparationTime = ref<number | null>(null) // Dauer in Minuten
const imagePreview = ref<string | null>(null) // Bildvorschau
const imageFile = ref<File | null>(null) // Bilddatei
const currentRating = ref<number>(0) // Rating
const currentDifficultLevel = ref<number>(1)

// Validation refs
const titleValidity = ref('pending')
const descriptionValidity = ref('pending')
const categoryValidity = ref('pending')
const durationValidity = ref('pending')
const ratingValidity = ref('pending')

// Funktion, um das Bild von der Upload-Komponente zu empfangen
const onFileSelected = (file: File) => {
  imageFile.value = file

  // Vorschau des Bildes anzeigen
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Wenn sich das Rating ändert
const onRatingUpdated = (rating: number) => {
  currentRating.value = rating
  validateInput('rating')
}

// Wenn sich die Schwierigkeit ändert
const onDifficultUpdated = (difficult: number) => {
  currentDifficultLevel.value = difficult
}

// Funktion zum Speichern des Rezepts
const saveRecipe = () => {
  const recipeData = {
    title: recipeTitle.value,
    description: recipeDescription.value,
    category: recipeCategory.value,
    preparationTime: preparationTime.value,
    rating: currentRating.value,
    difficulty: currentDifficultLevel.value,
  }
  sendRecipe(recipeData, imageFile.value)
}

// ----- Validation...
const validateInput = (field: string) => {
  switch (field) {
    case 'title':
      titleValidity.value = recipeTitle.value === '' ? 'invalid' : 'valid'
      break
    case 'description':
      descriptionValidity.value =
        recipeDescription.value === '' ? 'invalid' : 'valid'
      break
    case 'category':
      categoryValidity.value = recipeCategory.value === '' ? 'invalid' : 'valid'
      break
    case 'preparationTime':
      durationValidity.value =
        preparationTime.value === null || preparationTime.value < 1
          ? 'invalid'
          : 'valid'
      break
    case 'rating':
      ratingValidity.value = currentRating.value === 0 ? 'invalid' : 'valid'
      break
  }
}

const formValid = (): boolean => {
  return (
    titleValidity.value === 'valid' &&
    descriptionValidity.value === 'valid' &&
    categoryValidity.value === 'valid' &&
    durationValidity.value === 'valid' &&
    ratingValidity.value === 'valid'
  )
}
// ----- Validation...

// Funktion, um das Rezept zu senden (Neu und Änderungen)
async function sendRecipe(
  recipeData: RecipeBody,
  imageFile?: File,
  method: 'POST' | 'PATCH' = 'POST',
) {
  try {
    let response

    if (imageFile) {
      // FormData verwenden, wenn ein Bild vorhanden ist
      const formData = new FormData()
      formData.append('title', recipeData.title)
      formData.append('description', recipeData.description)
      formData.append('rating', recipeData.rating.toString())
      formData.append('difficulty', recipeData.difficulty.toString())
      formData.append('preparationTime', recipeData.preparationTime.toString())
      formData.append('category', recipeData.category)
      formData.append('image', imageFile) // Bild hinzufügen

      // Sende den POST-Request mit FormData
      response = await fetch(`${VITE_BACKEND_URL}/recipe`, {
        method,
        body: formData,
      })
    } else {
      // JSON senden, wenn kein Bild vorhanden ist
      response = await fetch(`${VITE_BACKEND_URL}/recipe`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      })
    }

    // Fehlerbehandlung, falls der Response nicht erfolgreich ist
    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Request failed: ${response.status} - ${errorMessage}`)
    }

    const result = await response.json()
    console.log('Rezept erfolgreich gesendet:', result)
    return result
  } catch (error) {
    console.error('Fehler beim Senden des Rezepts:', error)
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

.recipe-create {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: 800px;
  }

  @media (min-width: 1024px) {
    max-width: 1200px;
    gap: 30px; /* Mehr Platz zwischen den Elementen */
  }
}

.image-card {
  width: 100%;
  padding: 20px;
  text-align: center;

  @media (min-width: 1024px) {
    padding: 30px;
  }
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  background-color: #e0e0e0;
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: $font-color;
  margin-bottom: 1rem;

  @media (min-width: 1024px) {
    height: 300px; /* Größere Bildplatzhalter für Desktops */
    font-size: 20px;
  }
}

.image-preview {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: $border-radius;
  margin-bottom: 1rem;

  @media (min-width: 1024px) {
    max-width: 500px; /* Größere Vorschau auf Desktops */
  }
}

.form-card {
  width: 100%;
}

.text-input,
.textarea-input {
  font-family: inherit;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid $input-border-color;
  border-radius: $border-radius;
  font-size: 16px;

  @media (min-width: 1024px) {
    padding: 15px;
    font-size: 18px; /* Größere Schrift auf Desktops */
  }
}

.textarea-input {
  resize: none;
  height: 150px;

  @media (min-width: 1024px) {
    height: 200px; /* Mehr Platz für das Textfeld auf Desktops */
  }
}

.save-button {
  background-color: $primary-color;
  color: $inverse-font-color;
  padding: 15px 30px;
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: color.adjust($primary-color, $lightness: -10%);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  @media (min-width: 1024px) {
    padding: 20px 40px;
    font-size: 20px; /* Größere Buttons auf Desktops */
  }
}

.invalid {
  border-width: 1px;
  border-style: solid;
  border-color: red;
}
</style>
