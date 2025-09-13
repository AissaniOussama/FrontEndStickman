<script setup lang="ts">
import { RouterView } from 'vue-router'
import YouTubePlayer from '@/components/YoutubePlayer.vue'
</script>

<template>
  <!-- spielt im Hintergrund -->
  <YouTubePlayer videoId="NyQCiqfkTA8" :volume="15" />

  <RouterView />
</template>
