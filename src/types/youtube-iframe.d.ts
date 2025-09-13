export {}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
    YT?: {
      Player: new (el: string | HTMLElement, opts: any) => {
        playVideo(): void
        mute(): void
        unMute(): void
        setVolume(v: number): void
        isMuted(): boolean
        getVolume(): number
        destroy(): void
        getIframe(): HTMLIFrameElement
      }
    }
  }
}
