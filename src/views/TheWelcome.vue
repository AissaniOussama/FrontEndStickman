<template>
  <div class="page-container">
    <div class="content-wrapper">
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
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.content-wrapper {
  text-align: center;
  padding: 2rem;
}

h3.custom-font {
  font-family: 'HoaxVandal', sans-serif !important;
  font-size: 32px;
  margin-bottom: 2rem;
}

.main-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.stickman {
  width: 200px;
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
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
