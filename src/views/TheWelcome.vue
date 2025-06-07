<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h3 class="custom-font">Stickman Customizer</h3>

      <div class="main-layout">
        <div class="number-column">
          <div class="number-box" v-for="(_, index) in categoryImages" :key="'left-' + index">
            <button @click="decrease(index)">←</button>
          </div>
        </div>

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

        <div class="number-column">
          <div class="number-box" v-for="(_, index) in categoryImages" :key="'right-' + index">
            <button @click="increase(index)">→</button>
          </div>
        </div>
      </div>

      <button class="save-button" @click="saveToBackend">💾 Save</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { stickmanService } from '@/services/stickmanService'

const categoryImages = [
  ['Hat0.png','Hat1.png','Hat2.png','Hat3.png','Hat4.png','Hat5.png'],
  ['Top0.png','Top1.png','Top2.png','Top3.png','Top4.png','Top5.png'],
  ['Bot0.png','Bot1.png','Bot2.png','Bot3.png','Bot4.png','Bot5.png']
]

const currentIndexes = ref<number[]>([0, 0, 0])

function increase(index: number) {
  const len = categoryImages[index].length
  currentIndexes.value[index] = (currentIndexes.value[index] + 1) % len
}

function decrease(index: number) {
  const len = categoryImages[index].length
  currentIndexes.value[index] = (currentIndexes.value[index] - 1 + len) % len
}

function getImagePath(file: string) {
  return `/images/${file}`
}

const saveData = computed(() => ({
  name: 'Mein Stickman', // später optional dynamisch machen
  hat: categoryImages[0][currentIndexes.value[0]],
  top: categoryImages[1][currentIndexes.value[1]],
  bot: categoryImages[2][currentIndexes.value[2]]  // war vorher: bottom ❌
}))
async function saveToBackend() {
  try {
    const result = await stickmanService.saveStickman(saveData.value)
    console.log('✅ Stickman gespeichert:', result)
  } catch (error) {
    console.error('❌ Fehler beim Speichern:', error)
  }
}
</script>

<style scoped>
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-wrapper {
  text-align: center;
  padding: 2rem;
}

h3.custom-font {
  font-family: 'HoaxVandal', sans-serif;
  font-size: 32px;
  color: white;
  margin-bottom: 2rem;
}

.main-layout {
  display: flex;
  gap: 2rem;
  background: black;
  padding: 2rem;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
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
  pointer-events: none;
  z-index: 2;
}

.layer-0 {
  z-index: 4;
  top: -11px;
  width: 507px;
  left: 50%;
  transform: translateX(-50%);
}

.layer-1 {
  z-index: 3;
  top: -5px;
  width: 500px;
  left: 49%;
  transform: translateX(-50%);
}

.layer-2 {
  z-index: 2;
  top: 26px;
  width: 458px;
  left: 50%;
  transform: translateX(-50%);
}

.number-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.number-box {
  display: flex;
  gap: 0.5rem;
}

button {
  font-size: 18px;
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
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
  transition: 0.3s;
}

.save-button:hover {
  background-color: darkred;
  color: white;
}
</style>
