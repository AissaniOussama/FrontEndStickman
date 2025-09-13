/// <reference types="vite/client" />

// (optional) deine eigenen ENV-Keys stärker typisieren:
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  // weitere VITE_* Keys hier ergänzen …
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
