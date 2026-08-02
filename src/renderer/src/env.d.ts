declare module '*.css'

interface Window {
  store: import('../../preload').StoreBridge
}
