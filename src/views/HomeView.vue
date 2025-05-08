<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const start = () => {
  router.push('/TheWelcome')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h1 class="custom-font">Stickman App</h1>
      <div class="button-container">
        <button @click="start" class="start-button custom-font">START</button>
        <button @click="goToLogin" class="login-button custom-font">LOGIN</button>
      </div>
    </div>
  </div>
</template>

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

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
}

.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.start-button, .login-button {
  padding: 1rem 2rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-button {
  background-color: #000;
  color: white;
}

.login-button {
  background-color: #4CAF50;
  color: white;
}

.start-button:hover, .login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.custom-font {
  font-family: 'HoaxVandal', sans-serif !important;
}
</style>
