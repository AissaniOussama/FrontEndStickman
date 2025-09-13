<template>
  <div class="youtube-player-container">
    <div :id="containerId"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{ videoId: string; volume?: number }>()
const player = ref<any>(null)
const containerId = `yt-${Math.random().toString(36).slice(2)}`

function enableSound() {
  if (player.value) {
    player.value.unMute()
    player.value.setVolume(props.volume ?? 30)
  }
  window.removeEventListener('click', enableSound)
  window.removeEventListener('touchstart', enableSound)
}

onMounted(() => {
  if (!window.YT) {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
    window.onYouTubeIframeAPIReady = createPlayer
  } else {
    createPlayer()
  }
})

function createPlayer() {
  player.value = new window.YT.Player(containerId, {
    width: '640',
    height: '390',
    videoId: props.videoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1
    },
    events: {
      onReady: (ev: any) => {
        // Autoplay geht nur muted
        ev.target.mute()
        ev.target.playVideo()

        // Ton erst nach User-Interaktion aktivieren
        window.addEventListener('click', enableSound, { once: true })
        window.addEventListener('touchstart', enableSound, { once: true })
      }
    }
  })
}

onBeforeUnmount(() => {
  if (player.value?.destroy) player.value.destroy()
  window.removeEventListener('click', enableSound)
  window.removeEventListener('touchstart', enableSound)
})
</script>

<style scoped>
.youtube-player-container {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
}
</style>
