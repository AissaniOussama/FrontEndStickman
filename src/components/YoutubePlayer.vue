<template>
  <!-- versteckter Player -->
  <div :id="containerId" class="hidden-player"></div>

  <!-- kleiner Sound-Button oben links -->
  <teleport to="body">
    <button
      class="sound-btn"
      :style="{ '--size': size + 'px' }"
      :class="{ muted: isMuted }"
      @click.stop="toggleMute"
      aria-label="Sound"
      :aria-pressed="!isMuted"
    >
      <!-- PNG als Maske -> nur weiße Form, kein Quadrat -->
      <span class="icon-mask"></span>
    </button>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  videoId: string
  volume?: number   // Start-Lautstärke in %
  size?: number     // Button-Durchmesser in px
}>(), { volume: 15, size: 36 })

const containerId = `yt-${Math.random().toString(36).slice(2)}`
const player = ref<any>(null)
const isMuted = ref(true)
const START_VOL = Math.max(0, Math.min(100, props.volume ?? 15))
const size = props.size
const AUTO_UNMUTE_DELAY_MS = 1000

onMounted(() => {
  if (!window.YT) {
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(s)
    ;(window as any).onYouTubeIframeAPIReady = createPlayer
  } else {
    createPlayer()
  }
})

function createPlayer() {
  player.value = new window.YT.Player(containerId, {
    width: '640', height: '390', videoId: props.videoId,
    playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, playsinline: 1, mute: 1 },
    events: {
      onReady: async (ev: any) => {
        ev.target.mute()
        ev.target.setVolume(START_VOL)
        ev.target.playVideo()
        isMuted.value = true
        await nextTick()
        try { ev.target.getIframe()?.setAttribute('allow', 'autoplay') } catch {}
        setTimeout(tryAutoUnmute, AUTO_UNMUTE_DELAY_MS)
      }
    }
  })
}

async function tryAutoUnmute(retries = 1) {
  if (!player.value) return
  player.value.unMute()
  player.value.setVolume(START_VOL)
  isMuted.value = false
  await new Promise(r => setTimeout(r, 120))
  if (player.value.isMuted?.() || player.value.getVolume?.() === 0) {
    if (retries > 0) setTimeout(() => tryAutoUnmute(retries - 1), 600)
    else {
      const once = () => {
        player.value?.unMute()
        player.value?.setVolume(START_VOL)
        isMuted.value = false
        window.removeEventListener('click', once)
        window.removeEventListener('touchstart', once)
      }
      window.addEventListener('click', once, { once: true })
      window.addEventListener('touchstart', once, { once: true })
    }
  }
}

function toggleMute() {
  if (!player.value) return
  if (isMuted.value) {
    player.value.unMute()
    player.value.setVolume(START_VOL)
    isMuted.value = false
  } else {
    player.value.mute()
    isMuted.value = true
  }
}

onBeforeUnmount(() => {
  player.value?.destroy?.()
})
</script>

<style scoped>
/* Player unsichtbar/offscreen */
.hidden-player {
  position: absolute; top: -9999px; left: -9999px;
  width: 1px; height: 1px; opacity: 0; pointer-events: none; overflow: hidden;
}

/* Button oben links (etwas größer: 36px) */
.sound-btn {
  --size: 36px;
  position: fixed;
  top: 8px; left: 8px;
  z-index: 2147483647;
  width: var(--size);
  height: var(--size);
  border: none;
  padding: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  outline: 2px solid #ffffff;        /* weißer Rand wie beim ? */
  display: grid;
  place-items: center;
  cursor: pointer;
}
.sound-btn:active { transform: scale(0.97); }

/* Nur die Form deiner PNG anzeigen (weiß), KEIN Quadrat */
.icon-mask {
  width: 150%;
  height: 150%;
  background: #ffffff;               /* sichtbare Farbe des Icons */
  /* Masken für moderne Browser + WebKit */
  -webkit-mask-image: url('/icons/sound.png');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  -webkit-mask-position: center;
  mask-image: url('/icons/sound.png');
  mask-repeat: no-repeat;
  mask-size: contain;
  mask-position: center;
  mask-mode: luminance;              /* Weiß = sichtbar, Schwarz = transparent */
}

/* Optional: beim Mute leichte Rottönung des Rands (nur kosmetisch) */
.sound-btn.muted { outline-color: #ff5a5a; }
</style>
