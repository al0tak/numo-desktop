declare module '*.css'

interface Window {
  store: import('../../preload').StoreBridge
  files: import('../../preload').FilesBridge
  menu: import('../../preload').MenuBridge
}
