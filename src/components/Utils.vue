<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const start = () => {
  router.push('/TheWelcome')
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">Stickman App</h1>
    <button @click="start" class="start-button">START</button>
  </div>
</template>

<style scoped>
.greetings {
  text-align: center;
  margin-top: 20vh;
}

.start-button {
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  background-color: #000000;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 10px;
}
</style>
