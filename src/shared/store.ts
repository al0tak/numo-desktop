// Everything the app persists between launches — user settings, cached values.
// Add a key here (with a default below) and it is immediately available, typed,
// from both the main process and the renderer.
export type StoreSchema = {
  theme: 'system' | 'light' | 'dark'
}

export const storeDefaults: StoreSchema = {
  theme: 'system'
}
