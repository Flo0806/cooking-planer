<template>
  <div class="upload-image">
    <!-- Unsichtbares Standard-File-Input -->
    <input
      type="file"
      accept="image/*"
      ref="fileInput"
      @change="onFileSelected"
      class="file-input"
    />

    <!-- Benutzerdefinierter Button -->
    <button class="upload-button" @click="triggerFileInput">
      Bild auswählen
    </button>

    <!-- Dateiname, falls vorhanden -->
    <p v-if="fileName" class="file-name">{{ truncatedFileName }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

// Ref für den Dateinamen und die maximale Länge
const fileName = ref<string | null>(null)
const maxFileNameLength = 20

// defineEmits verwenden, um Events an die übergeordnete Komponente zu senden
const emit = defineEmits(['file-selected'])

// Funktion, um den Dateiauswahl-Dialog zu öffnen
const triggerFileInput = () => {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')
  input?.click()
}

// Funktion, die beim Auswählen einer Datei aufgerufen wird
const onFileSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    fileName.value = file.name
    emit('file-selected', file) // Emitiere das File-Objekt an den Eltern
  }
}

// Abkürzen des Dateinamens, wenn er zu lang ist
const truncatedFileName = computed(() => {
  if (fileName.value && fileName.value.length > maxFileNameLength) {
    return `${fileName.value.slice(0, maxFileNameLength)}...`
  }
  return fileName.value
})
</script>

<style lang="scss" scoped>
@use 'sass:color';

.upload-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.file-input {
  display: none; /* Macht das Standard-Input unsichtbar */
}

.upload-button {
  background-color: $primary-color;
  color: $inverse-font-color;
  padding: 10px 20px;
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: color.adjust($primary-color, $lightness: -10%);
  }
}

.file-name {
  font-size: 14px;
  color: $font-color;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Truncating too long filenames */
}
</style>
