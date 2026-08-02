import { ipcMain } from 'electron'
import ElectronStore from 'electron-store'
import { storeDefaults, type StoreSchema } from '../shared/store'

// A JSON file in the OS-specific user data directory (app.getPath('userData')),
// written atomically. The main process owns it; the renderer reaches it through
// the preload bridge and the handlers below.
export const store = new ElectronStore<StoreSchema>({ defaults: storeDefaults })

export function registerStoreIpc(): void {
  // The default is passed on every read as well as seeded into the file, so a
  // deleted or not-yet-written key still resolves to it.
  ipcMain.handle('store:get', (_event, key: keyof StoreSchema) =>
    store.get(key, storeDefaults[key])
  )
  ipcMain.handle('store:set', (_event, key: keyof StoreSchema, value: unknown) => {
    store.set(key, value)
  })
  ipcMain.handle('store:delete', (_event, key: keyof StoreSchema) => {
    store.delete(key)
  })
}
