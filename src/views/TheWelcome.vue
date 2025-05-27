<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h3 class="custom-font">Stickman Customizer</h3>
      <div class="main-layout">
        <!-- Linke Buttons -->
        <div class="number-column">
          <div
            class="number-box"
            v-for="(_, index) in categoryImages"
            :key="'left-' + index"
          >
            <button @click="decrease(index)">←</button>
          </div>
        </div>

        <!-- Stickman mit Zubehör -->
        <div class="canvas-wrapper">
          <div class="stickman-container">
            <img src="/images/stickman-base.png" alt="Stickman" class="stickman" />
            <img
              v-for="(images, i) in categoryImages"
              :key="'layer-' + i"
              :src="getImagePath(images[currentIndexes[i]])"
              class="accessory"
              :class="'layer-' + i"
            />
          </div>
        </div>

        <!-- Rechte Buttons -->
        <div class="number-column">
          <div
            class="number-box"
            v-for="(_, index) in categoryImages"
            :key="'right-' + index"
          >
            <button @click="increase(index)">→</button>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <button class="save-button" @click="saveToBackend">💾 Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Bildpfade je Kategorie
const categoryImages = [
  ['Hat1.png', 'Hat2.png', 'Hat3.png', 'Hat4.png'],        // Hüte
  ['Top1.png', 'Top2.png', 'Top3.png', 'Top4.png'],        // Oberteile
  ['Bottom1.png', 'Bottom2.png', 'Bottom3.png', 'Bottom4.png'] // Hosen
]


// Aktuelle Auswahl je Kategorie
const currentIndexes = ref<number[]>([0, 0, 0])

function increase(index: number) {
  const len = categoryImages[index].length
  currentIndexes.value[index] = (currentIndexes.value[index] + 1) % len
}

function decrease(index: number) {
  const len = categoryImages[index].length
  currentIndexes.value[index] = (currentIndexes.value[index] - 1 + len) % len
}

// Bildpfade aus public/images/
function getImagePath(file: string) {
  return `/images/${file}`
}

// Für spätere Speicherung
const saveData = computed(() => ({
  hat: categoryImages[0][currentIndexes.value[0]],
  top: categoryImages[1][currentIndexes.value[1]],
  bottom: categoryImages[2][currentIndexes.value[2]]
}))

function saveToBackend() {
  console.log('Saving to backend:', JSON.stringify(saveData.value))
}
</script>

<style scoped>
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
}

.content-wrapper {
  text-align: center;
  padding: 2rem;
}

h3.custom-font {
  font-family: 'HoaxVandal', sans-serif;
  font-size: 32px;
  margin-bottom: 2rem;
  color: white;
}

.main-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background-color: black;
  padding: 2rem;
  border-radius: 10px;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.stickman-container {
  position: relative;
  width: 484px;
  height: 430px;
}

.stickman {
  width: 100%;
  height: auto;
  z-index: 1;
}

.accessory {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 2;
}
//width: 484px;
//height: 430px;
/* Layer-Positionen */
.layer-0 {     top: 70px; width: 100px;;}   /* Hat */
.layer-1 { top: 90px; width: 120px; }    /* Shirt */
.layer-2 { top: 180px; width: 100px; }   /* Shoes */

.number-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  color: white;
}

.number-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

button {
  font-size: 18px;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

.save-button {
  margin-top: 2rem;
  padding: 0.6rem 1.2rem;
  font-size: 18px;
  background-color: white;
  color: red;
  border: none;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: darkred;
  color: white;
}
</style>
