<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { stickmanService } from '@/services/stickmanService'

const router = useRouter()

const start = () => router.push('/TheWelcome')
const goToLogin = () => router.push('/login')

// Curtain nur beim ersten Besuch anzeigen
const showCurtain = ref(false)
const onCurtainEnd = () => { showCurtain.value = false }

onMounted(async () => {
  // Intro nur einmal zeigen (persistiert im Browser)
  const hasPlayed = localStorage.getItem('introPlayed')
  if (!hasPlayed) {
    showCurtain.value = true
    localStorage.setItem('introPlayed', 'true')
  }

  // (Optional) API-Test wie bei dir
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
    <!-- Vollflächige, leicht transparente Typo -->
    <div class="hero-title custom-font" aria-hidden="true">
      Stickman&nbsp;App
    </div>

    <div class="content-wrapper">
      <h1 class="custom-font">Stickman App</h1>
      <div class="button-container">
        <button @click="start" class="custom-button custom-font">START</button>
        <button @click="goToLogin" class="custom-button custom-font">SHOW</button>
      </div>
    </div>

    <!-- Weiße, abgerundet nach unten gehende Wand -->
    <div
      v-if="showCurtain"
      class="intro-curtain"
      @animationend="onCurtainEnd"
      aria-hidden="true"
    ></div>
  </div>
</template>

<style scoped>
/* Grundlayout */
.page-container {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background-color: black;
  overflow: hidden; /* wichtig für den Vorhang */
}

.content-wrapper {
  position: relative;
  z-index: 10;
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

/* 1) Vollflächige Schrift */
.hero-title {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 1;               /* Hinter den Buttons/Texten */
  pointer-events: none;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #fff;
  opacity: 0.08;            /* Leicht transparent */
  font-size: clamp(6rem, 18vw, 24rem);
  animation: titleIn 900ms ease-out both;
}

@keyframes titleIn {
  from { transform: scale(1.04); opacity: 0; }
  to   { transform: scale(1);    opacity: 0.08; }
}

/* 2) Hellgraue Wand mit abgerundeter Unterkante – nur beim ersten Besuch */
.intro-curtain {
  position: fixed;
  inset: 0;                /* deckt die ganze Seite ab */
  background: #f5f5f5;     /* hellgrau statt purem Weiß */
  z-index: 1000;           /* über allem */
  animation: dropAndFade 2s ease-in-out forwards;
  overflow: hidden;        /* Rundung bleibt sauber */
}

/* Abgerundete Unterkante als „Kuppel“ */
.intro-curtain::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -25vh;           /* weiter unten für stärkere Rundung */
  width: 160vw;            /* breiter als die Seite */
  height: 60vh;            /* höher für größere Rundung */
  background: #f5f5f5;     /* gleiches Hellgrau */
  border-radius: 50%;
}

/* Animation: startet komplett grau → fährt nach unten raus */
@keyframes dropAndFade {
  0%   { transform: translateY(0);    opacity: 1; }
  70%  { transform: translateY(0);    opacity: 1; }
  100% { transform: translateY(100%); opacity: 1; }
}

/* Bewegungsreduktion */
@media (prefers-reduced-motion: reduce) {
  .hero-title { animation: none; }
  .intro-curtain { animation-duration: 0.01ms; }
}
</style>
