<template>
  <h3 class="custom-font">Stickman Customizer</h3>

  <div class="number-column">
    <div
      class="number-box"
      v-for="(value, index) in numbers"
      :key="index"
    >
      <button @click="decrease(index)">←</button>
      <span>{{ value }}</span>
      <button @click="increase(index)">→</button>
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

.number-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 2rem;
}

.number-box {
  font-family: 'HoaxVandal', sans-serif;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

button {
  font-size: 20px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
}
</style>
