<template>

    <div class="page-container">
      <div class="content-wrapper">
        <h3 class="custom-font">Stickman Customizer</h3>

        <!-- 🆕 Namenseingabe + Zufallsbutton -->
        <div class="name-input-container">
          <input
            v-model="customName"
            placeholder="Name eingeben..."
            class="name-input custom-font"
          />
          <button @click="generateRandomName" class="random-button custom-font">?</button>
        </div>

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

// Stickman Layers
const categoryImages = [
  ['Hat0.png','Hat1.png','Hat2.png','Hat3.png','Hat4.png','Hat5.png'],
  ['Top0.png','Top1.png','Top2.png','Top3.png','Top4.png','Top5.png'],
  ['Bot0.png','Bot1.png','Bot2.png','Bot3.png','Bot4.png','Bot5.png']
]

const currentIndexes = ref<number[]>([0, 0, 0])
const customName = ref('')

// Randomname-Komponenten
const prefixes = ['Mr.', 'Dr.', 'Prof.', 'Big', 'Young', 'Lil', 'BIGMAN', 'poor', 'ugly', 'swaggy']
const names = ['SchöneMann', 'Brada', 'BIGMAN', 'Swagmaster', 'O', 'Oldman', 'SwagBoy', 'Bird', 'Lion', 'Eagle', 'MoneyBoy']

function generateRandomName() {
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const randomName = names[Math.floor(Math.random() * names.length)]
  customName.value = `${randomPrefix} ${randomName}`
}

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
  name: customName.value.trim() === '' ? 'Mein Stickman' : customName.value.trim(),
  hat: categoryImages[0][currentIndexes.value[0]],
  top: categoryImages[1][currentIndexes.value[1]],
  bot: categoryImages[2][currentIndexes.value[2]]
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

/* 🆕 Name-Eingabe mit Button */
.name-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.name-input {
  background: black;
  border: none;
  border-bottom: 2px solid white;
  color: white;
  font-size: 20px;
  padding: 0.4rem 0.8rem;
  width: 280px;
  outline: none;
  text-align: center;

}


.random-button {
  font-size: 22px;
  background: black;
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.random-button:hover {
  background: white;
  color: black;
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
  font-family: 'HoaxVandal', sans-serif;
}


.save-button:hover {
  background-color: darkred;
  color: white;
}
</style>
