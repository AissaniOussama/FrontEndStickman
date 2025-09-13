// src/types/youtube-iframe.d.ts
export {}

declare global {
  interface Window {
    // YT bewusst NICHT optional, damit TS kein "possibly undefined" meckert
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}
