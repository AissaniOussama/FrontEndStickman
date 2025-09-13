<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h3 class="title">Stickman Viewer</h3>

      <div class="input-group">
        <input
          v-model="ownerFilter"
          @input="filterByOwner"
          placeholder="Filter nach Ersteller..."
          class="input-field"
          :class="{ 'focused': currentFocus === 0 }"
        />
        <input
          v-model="stickmanName"
          placeholder="Mein Stickman"
          class="input-field"
          readonly
          :class="{ 'focused': currentFocus === 1 }"
        />
      </div>

      <div class="main-layout">
        <button class="arrow-button" @click="prev" :class="{ 'focused': currentFocus === 2 }">←</button>

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

        <button class="arrow-button" @click="next" :class="{ 'focused': currentFocus === 3 }">→</button>
      </div>

      <div class="button-row">
        <button class="export-button" @click="exportAsPNG" :class="{ 'focused': currentFocus === 4 }">Export PNG</button>
        <button class="back-button" @click="goBack" :class="{ 'focused': currentFocus === 5 }">BACK</button>
      </div>

      <div class="keyboard-help">
        <span class="help-text">⌨️ Tab: Switch focus • ← →: Navigate • Space/Enter: Activate</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { stickmanService } from '@/services/stickmanService'
import type { Stickman } from '@/types/Stickman'

const router = useRouter()
const stickmanContainer = ref<HTMLElement>()

const categoryImages = [
  ['Hat0.png', 'Hat1.png', 'Hat2.png', 'Hat3.png', 'Hat4.png', 'Hat5.png'],
  ['Top0.png', 'Top1.png', 'Top2.png', 'Top3.png', 'Top4.png', 'Top5.png'],
  ['Bot0.png', 'Bot1.png', 'Bot2.png', 'Bot3.png', 'Bot4.png', 'Bot5.png']
]

const stickmen = ref<Stickman[]>([])
const filteredStickmen = ref<Stickman[]>([])
const currentStickmanIndex = ref(0)
const currentIndexes = ref<number[]>([0, 0, 0])
const ownerFilter = ref('')
const stickmanName = ref('')
const currentFocus = ref(0) // 0=owner filter, 1=name field, 2=prev, 3=next, 4=export, 5=back

function getImagePath(file: string) {
  return `/images/${file}`
}

function applyStickman(stickman: Stickman) {
  currentIndexes.value = [
    categoryImages[0].indexOf(stickman.hat),
    categoryImages[1].indexOf(stickman.top),
    categoryImages[2].indexOf(stickman.bot)
  ].map(i => i >= 0 ? i : 0)
  stickmanName.value = stickman.name
}

function next() {
  if (filteredStickmen.value.length === 0) return
  currentStickmanIndex.value = (currentStickmanIndex.value + 1) % filteredStickmen.value.length
  applyStickman(filteredStickmen.value[currentStickmanIndex.value])
}

function prev() {
  if (filteredStickmen.value.length === 0) return
  currentStickmanIndex.value = (currentStickmanIndex.value - 1 + filteredStickmen.value.length) % filteredStickmen.value.length
  applyStickman(filteredStickmen.value[currentStickmanIndex.value])
}

function filterByOwner() {
  const search = ownerFilter.value.trim().toLowerCase()
  filteredStickmen.value = search === ''
    ? [...stickmen.value]
    : stickmen.value.filter(s => s.owner?.toLowerCase().includes(search))
  currentStickmanIndex.value = 0
  if (filteredStickmen.value.length > 0) applyStickman(filteredStickmen.value[0])
}

function goBack() {
  router.push('/')
}

function sanitizeFilename(name: string) {
  const trimmed = (name || '').trim()
  const fallback = 'MeinStickman'
  return (trimmed || fallback).replace(/[\/\\?%*:|"<>]/g, '_')
}

async function exportAsPNG() {
  if (!stickmanContainer.value) return
  const containerEl = stickmanContainer.value
  const dpr = window.devicePixelRatio || 1

  const baseEl = containerEl.querySelector('img.stickman') as HTMLImageElement

  const accessoryEls = Array.from(
    containerEl.querySelectorAll('img.accessory')
  ) as HTMLImageElement[]

  // Sortierung nach z-index (aufsteigend)
  const originalOrder = new Map(accessoryEls.map((el, i) => [el, i]))
  const getZ = (el: Element) => {
    const z = parseInt(getComputedStyle(el).zIndex || '0', 10)
    return Number.isFinite(z) ? z : 0
  }
  const sortedAccessories = accessoryEls
    .slice()
    .sort((a, b) => {
      const za = getZ(a)
      const zb = getZ(b)
      return za !== zb ? za - zb : (originalOrder.get(a)! - originalOrder.get(b)!)
    })

  const allEls = [baseEl, ...sortedAccessories].filter(Boolean)

  // Bounding-Box
  let minLeft = Infinity, minTop = Infinity, maxRight = -Infinity, maxBottom = -Infinity
  allEls.forEach((el) => {
    const r = el.getBoundingClientRect()
    minLeft = Math.min(minLeft, r.left)
    minTop = Math.min(minTop, r.top)
    maxRight = Math.max(maxRight, r.right)
    maxBottom = Math.max(maxBottom, r.bottom)
  })

  const width = maxRight - minLeft
  const height = maxBottom - minTop
  const PADDING = 0

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = Math.round((width + PADDING * 2) * dpr)
  canvas.height = Math.round((height + PADDING * 2) * dpr)
  ctx.scale(dpr, dpr)

  const drawImgAtRect = (el: HTMLImageElement) =>
    new Promise<void>((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const r = el.getBoundingClientRect()
        const x = (r.left - minLeft) + PADDING
        const y = (r.top - minTop) + PADDING
        ctx.drawImage(img, x, y, r.width, r.height)
        resolve()
      }
      img.src = el.src
    })

  // Base zuerst, dann sortierte Accessories
  await drawImgAtRect(baseEl)
  for (const el of sortedAccessories) await drawImgAtRect(el)

  const fileName = sanitizeFilename(stickmanName.value) + '.png'

  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  })
}

onMounted(async () => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) return

    if (event.key === 'Tab') {
      event.preventDefault()
      currentFocus.value = (currentFocus.value + 1) % 6
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (currentFocus.value === 2) currentFocus.value = 5
      else if (currentFocus.value === 3) currentFocus.value = 2
      else if (currentFocus.value === 4) currentFocus.value = 3
      else if (currentFocus.value === 5) currentFocus.value = 4
      else prev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (currentFocus.value === 2) currentFocus.value = 3
      else if (currentFocus.value === 3) currentFocus.value = 4
      else if (currentFocus.value === 4) currentFocus.value = 5
      else if (currentFocus.value === 5) currentFocus.value = 2
      else next()
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (currentFocus.value === 2) prev()
      else if (currentFocus.value === 3) next()
      else if (currentFocus.value === 4) exportAsPNG()
      else if (currentFocus.value === 5) goBack()
    }
  }

  document.addEventListener('keydown', handleKeydown)

  try {
    const data = await stickmanService.getStickmen()
    stickmen.value = data
    filteredStickmen.value = data
    if (data.length > 0) applyStickman(data[0])
  } catch (err) {
    console.error('❌ Error loading stickmen:', err)
    stickmanName.value = 'Backend not connected'
  }
})
</script>

<style scoped>
.page-container {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: black; display: flex; justify-content: center; align-items: center; zoom: 0.8;
}
.content-wrapper { text-align: center; padding: 2rem; }
.title { font-family: 'HoaxVandal', sans-serif; font-size: 32px; color: white; margin-bottom: 2rem; }

.input-group { display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.input-field {
  background: black; border: none; border-bottom: 2px solid white; color: white;
  font-size: 20px; padding: 0.4rem 0.8rem; width: 280px; outline: none; text-align: center; font-family: sans-serif;
}

.main-layout { display: flex; gap: 2rem; padding: 2rem; border-radius: 10px; align-items: center; justify-content: center; background: black; }
.canvas-wrapper { display: flex; justify-content: center; align-items: center; }
.stickman-container { position: relative; width: 484px; height: 430px; }
.stickman { width: 100%; height: auto; z-index: 1; }
.accessory { position: absolute; pointer-events: none; z-index: 2; }

.layer-0 { z-index: 4; top: -11px; width: 507px; left: 50%; transform: translateX(-50%); }
.layer-1 { z-index: 3; top: -5px; width: 500px; left: 49%; transform: translateX(-50%); }
.layer-2 { z-index: 2; top: 26px; width: 458px; left: 50%; transform: translateX(-50%); }

.arrow-button {
  font-size: 24px; padding: 0.6rem 1rem; border-radius: 6px; background-color: white; color: black;
  font-weight: bold; border: none; cursor: pointer; transition: 0.2s;
}
.arrow-button:hover { background-color: darkred; color: white; }

.back-button, .export-button {
  padding: 0.6rem 1.2rem; font-size: 18px; background-color: white; color: black;
  border: none; border-radius: 6px; transition: 0.3s; font-family: 'HoaxVandal', sans-serif;
}
.back-button:hover, .export-button:hover { background-color: darkred; color: white; }

.button-row { display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; }

.focused { background-color: darkred !important; color: white !important; transform: scale(1.1); box-shadow: 0 0 10px rgba(255,255,255,0.5); }
.input-field.focused { border-bottom: 3px solid darkred; background-color: rgba(139,0,0,0.1); }

.keyboard-help { margin-top: 2rem; padding: 0.6rem 1rem; background-color: white; border-radius: 6px; text-align: center; }
.help-text { font-size: 14px; color: black; font-family: sans-serif; }
</style>
