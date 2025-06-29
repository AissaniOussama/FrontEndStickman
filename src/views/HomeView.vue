<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { stickmanService } from '@/services/stickmanService'

const router = useRouter()

const start = () => {
  router.push('/TheWelcome')
}

const goToLogin = () => {
  router.push('/login')
}

onMounted(async () => {
  try {
    const data = await stickmanService.getStickmen()
    console.log('✅ API test: Stickman-Daten erfolgreich geladen:', data)
  } catch (err) {
    console.error('❌ API-Fehler beim Laden der Stickman-Daten:', err)
  }
})
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h1 class="custom-font">Stickman App</h1>
      <div class="button-container">
        <button @click="start" class="custom-button custom-font">START</button>
        <button @click="goToLogin" class="custom-button custom-font">SHOW</button>
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
  background-color: black;
}

.content-wrapper {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  color: white;
}

.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.custom-button {
  padding: 1rem 2.5rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: white;
  color: black;
  transition: all 0.3s ease;
}

.custom-button:hover {
  background-color: darkred;
  color: white;
  transform: translateY(-2px);
}

.custom-font {
  font-family: 'HoaxVandal', sans-serif !important;
}
</style>
