import { contextBridge, ipcRenderer } from 'electron'
import type { StoreSchema } from '../shared/store'

const store = {
  get: <K extends keyof StoreSchema>(key: K): Promise<StoreSchema[K]> => ipcRenderer.invoke('store:get', key),
  set: <K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): Promise<void> =>
    ipcRenderer.invoke('store:set', key, value),
  // Drops the stored value so the key falls back to its default.
  delete: (key: keyof StoreSchema): Promise<void> => ipcRenderer.invoke('store:delete', key)
}

export type StoreBridge = typeof store

contextBridge.exposeInMainWorld('store', store)
