<template>
  <h3 class="custom-font">Stickman Customizer</h3>
  <div class="main-layout">
    <div class="number-column">
      <div
        class="number-box"
        v-for="(value, index) in numbers"
        :key="'left-' + index"
      >
        <button @click="decrease(index)">←</button>
        <span>{{ value }}</span>
      </div>
    </div>

    <div class="canvas-wrapper">
      <img src="@/assets/images/stickman-base.png" alt="Stickman" class="stickman" />
    </div>

    <div class="number-column">
      <div
        class="number-box"
        v-for="(value, index) in numbers"
        :key="'right-' + index"
      >
        <button @click="increase(index)">→</button>
        <span>{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const numbers = ref<number[]>([1, 1, 1])

function increase(index: number) {
  numbers.value[index] = numbers.value[index] % 5 + 1
}

function decrease(index: number) {
  numbers.value[index] = (numbers.value[index] - 2 + 5) % 5 + 1
}
</script>

<style scoped>
h3.custom-font {
  font-family: 'HoaxVandal', sans-serif !important;
  font-size: 32px;
  text-align: center;
}

.main-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.stickman {
  width: 200px; /* oder eine andere passende Größe */
  height: auto;
}

.number-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.number-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'HoaxVandal', sans-serif;
  font-size: 20px;
}

button {
  font-size: 18px;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
}
</style>
