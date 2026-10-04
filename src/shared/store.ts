// Everything the app persists between launches — user settings, cached values.
// Add a key here (with a default below) and it is immediately available, typed,
// from both the main process and the renderer.
export type StoreSchema = {
  theme: 'system' | 'light' | 'dark'
  // The folder the last Save As landed in, where the next one starts. Null
  // until the first save, which starts in the user's Documents folder.
  saveFolder: string | null
}

export const storeDefaults: StoreSchema = {
  theme: 'system',
  saveFolder: null
}
