<template>
  <div class="stickman-list">
    <h2 class="custom-font">Stickmen</h2>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="stickman-grid">
      <div v-for="stickman in stickmen" :key="stickman.id" class="stickman-card">
        <h3 class="custom-font">{{ stickman.name }}</h3>
        <p class="custom-font">{{ stickman.hat }}</p>
        <p>{{ stickman.top }}</p>
        <p>{{ stickman.bot }}</p>
        <p><strong>Owner:</strong> {{ stickman.owner }}</p> <!-- Owner wird hier angezeigt -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { stickmanService } from '../services/stickmanService'
import { ref, onMounted } from 'vue'
import type { Stickman } from '../types/Stickman'

const stickmen = ref<Stickman[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Test API Connection
    const testResult = await stickmanService.testApi()
    console.log('API Test Result:', testResult)

    // Fetch stickmen
    stickmen.value = await stickmanService.getStickmen()
    console.log('Fetched Stickmen:', stickmen.value)
  } catch (err) {
    error.value = 'Failed to load stickmen. Please try again later.'
    console.error('Error loading stickmen:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.stickman-list {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stickman-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.stickman-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stickman-card:hover {
  transform: translateY(-4px);
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

.error {
  color: #ff0000;
  text-align: center;
  padding: 1rem;
  background: #fff0f0;
  border-radius: 4px;
  margin: 1rem 0;
}

.custom-font {
  font-family: 'HoaxVandal', sans-serif !important;
}
</style>
