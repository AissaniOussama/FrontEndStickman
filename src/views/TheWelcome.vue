<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h3 class="custom-font">Stickman Customizer</h3>

      <!-- Name-Eingabe mit Button -->
      <div class="name-input-container">
        <input
          v-model="customName"
          placeholder="Name eingeben..."
          class="name-input custom-font"
        />
        <button @click="generateRandomName" class="random-button custom-font">?</button>
      </div>

      <!-- Besitzer-Eingabe mit unsichtbarem Platzhalter-Button -->
      <div class="name-input-container">
        <input
          v-model="customOwner"
          placeholder="Ersteller des Stickman..."
          class="name-input custom-font"
        />
        <button disabled class="random-button transparent-button"></button>
      </div>

      <div class="main-layout">
        <div class="number-column">
          <div class="number-box" v-for="(_, index) in categoryImages" :key="'left-' + index">
            <div class="category-label" :class="{ 'focused': currentFocus === index }">
              {{ index === 0 ? 'Hat' : index === 1 ? 'Top' : 'Bot' }}
            </div>
            <button @click="decrease(index)" :class="{ 'focused': currentFocus === index }">←</button>
          </div>
        </div>

        <div class="canvas-wrapper">
          <div class="stickman-container" ref="stickmanContainer">
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
            <div class="category-label" :class="{ 'focused': currentFocus === index }">
              {{ index === 0 ? 'Hat' : index === 1 ? 'Top' : 'Bot' }}
            </div>
            <button @click="increase(index)" :class="{ 'focused': currentFocus === index }">→</button>
          </div>
        </div>
      </div>

      <!-- Save, Export & Back Buttons nebeneinander -->
      <div class="button-row">
        <button class="export-button" @click="exportAsPNG" :class="{ 'focused': currentFocus === 3 }">Export PNG</button>
        <button class="save-button" @click="saveToBackend" :class="{ 'focused': currentFocus === 4 }">Save</button>
        <button class="back-button" @click="goBack" :class="{ 'focused': currentFocus === 5 }">Back</button>
      </div>

      <!-- Keyboard navigation help -->
      <div class="keyboard-help">
        <span class="help-text">⌨️ Tab: Switch focus • ← →: Change selection • Space/Enter: Activate</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { stickmanService } from '@/services/stickmanService'
import { useRouter } from 'vue-router'

const router = useRouter()
const stickmanContainer = ref<HTMLElement>()

const categoryImages = [
  ['Hat0.png', 'Hat1.png', 'Hat2.png', 'Hat3.png', 'Hat4.png', 'Hat5.png'],
  ['Top0.png', 'Top1.png', 'Top2.png', 'Top3.png', 'Top4.png', 'Top5.png'],
  ['Bot0.png', 'Bot1.png', 'Bot2.png', 'Bot3.png', 'Bot4.png', 'Bot5.png']
]

const currentIndexes = ref<number[]>([0, 0, 0])
const customName = ref('')
const customOwner = ref('')
const currentFocus = ref(0) // 0=hat, 1=top, 2=bot, 3=export, 4=save, 5=back

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
  owner: customOwner.value.trim() === '' ? null : customOwner.value.trim(),
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

function goBack() {
  router.push('/')
}

function exportAsPNG() {
  if (!stickmanContainer.value) return

  // Get the actual size of the stickman container
  const containerRect = stickmanContainer.value.getBoundingClientRect()
  const containerWidth = containerRect.width
  const containerHeight = containerRect.height

  // Create a canvas element
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set canvas size to match the actual stickman container
  canvas.width = containerWidth
  canvas.height = containerHeight

  // Create a temporary div to render the stickman
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.width = containerWidth + 'px'
  tempDiv.style.height = containerHeight + 'px'
  tempDiv.style.position = 'relative'
  document.body.appendChild(tempDiv)

  // Clone the stickman images
  const baseImg = new Image()
  baseImg.crossOrigin = 'anonymous'
  baseImg.onload = () => {
    ctx.drawImage(baseImg, 0, 0, containerWidth, containerHeight)

    // Load and draw accessories
    let loadedImages = 0
    const totalImages = categoryImages.length

    categoryImages.forEach((images, i) => {
      const accessoryImg = new Image()
      accessoryImg.crossOrigin = 'anonymous'
      accessoryImg.onload = () => {
        // Calculate scaling factor based on container size
        const scaleFactor = containerWidth / 484 // Original width is 484px

        // Apply the same positioning as CSS with scaling
        let x = containerWidth / 2 // center
        let y = 0
        let width = containerWidth

        if (i === 0) { // hat
          y = -11 * scaleFactor
          width = 507 * scaleFactor
        } else if (i === 1) { // top
          y = -5 * scaleFactor
          width = 500 * scaleFactor
        } else if (i === 2) { // bot
          y = 26 * scaleFactor
          width = 458 * scaleFactor
        }

        ctx.drawImage(accessoryImg, x - width/2, y, width, width * accessoryImg.height / accessoryImg.width)

        loadedImages++
        if (loadedImages === totalImages) {
          // All images loaded, create download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${customName.value || 'stickman'}.png`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }
          })
          document.body.removeChild(tempDiv)
        }
      }
      accessoryImg.src = getImagePath(images[currentIndexes.value[i]])
    })
  }
  baseImg.src = '/images/stickman-base.png'
}

onMounted(() => {
  // Add keyboard listener for tab and arrow navigation
  const handleKeydown = (event: KeyboardEvent) => {
    // Don't interfere if user is typing in input fields
    if (event.target instanceof HTMLInputElement) {
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      // Cycle through focus areas: hat -> top -> bot -> export -> save -> back
      currentFocus.value = (currentFocus.value + 1) % 6
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (currentFocus.value < 3) {
        // In a category, change accessory
        decrease(currentFocus.value)
      } else if (currentFocus.value === 3) {
        // On export button, go to back button
        currentFocus.value = 5
      } else if (currentFocus.value === 4) {
        // On save button, go to export button
        currentFocus.value = 3
      } else if (currentFocus.value === 5) {
        // On back button, go to save button
        currentFocus.value = 4
      } else {
        // If not focused on anything specific, change hat
        decrease(0)
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (currentFocus.value < 3) {
        // In a category, change accessory
        increase(currentFocus.value)
      } else if (currentFocus.value === 3) {
        // On export button, go to save button
        currentFocus.value = 4
      } else if (currentFocus.value === 4) {
        // On save button, go to back button
        currentFocus.value = 5
      } else if (currentFocus.value === 5) {
        // On back button, go to export button
        currentFocus.value = 3
      } else {
        // If not focused on anything specific, change hat
        increase(0)
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      // Switch to previous category
      currentFocus.value = (currentFocus.value - 1 + 3) % 3
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      // Switch to next category
      currentFocus.value = (currentFocus.value + 1) % 3
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (currentFocus.value === 3) {
        exportAsPNG()
      } else if (currentFocus.value === 4) {
        saveToBackend()
      } else if (currentFocus.value === 5) {
        goBack()
      }
    } else if (event.key === ' ') {
      event.preventDefault()
      if (currentFocus.value === 3) {
        exportAsPNG()
      } else if (currentFocus.value === 4) {
        saveToBackend()
      } else if (currentFocus.value === 5) {
        goBack()
      }
    }
  }

  document.addEventListener('keydown', handleKeydown)
})
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
  zoom: 0.8;
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

.name-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.2rem;
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

.transparent-button {
  visibility: hidden;
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

.button-row {
  margin-top: 2rem;
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.save-button, .back-button {
  padding: 0.6rem 1.2rem;
  font-size: 18px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 6px;
  transition: 0.3s;
  font-family: 'HoaxVandal', sans-serif;
}

.save-button:hover, .back-button:hover {
  background-color: darkred;
  color: white;
}

.export-button {
  padding: 0.6rem 1.2rem;
  font-size: 18px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 6px;
  transition: 0.3s;
  font-family: 'HoaxVandal', sans-serif;
}

.export-button:hover {
  background-color: darkred;
  color: white;
}

.focused {
  background-color: darkred !important;
  color: white !important;
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.keyboard-help {
  margin-top: 1rem;
  text-align: center;
  padding: 0.6rem 1rem;
  background-color: white;
  border-radius: 6px;
}

.help-text {
  font-size: 14px;
  color: black;
  font-family: sans-serif;
}

.category-label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
  transition: all 0.3s ease;
}

.category-label.focused {
  color: darkred;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}
</style>
