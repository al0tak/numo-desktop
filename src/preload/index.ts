import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRendererEvent } from 'electron'
import type { CloseChoice, MenuCommand, OpenedFile } from '../shared/files'
import type { StoreSchema } from '../shared/store'

const store = {
  get: <K extends keyof StoreSchema>(key: K): Promise<StoreSchema[K]> => ipcRenderer.invoke('store:get', key),
  set: <K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): Promise<void> =>
    ipcRenderer.invoke('store:set', key, value),
  // Drops the stored value so the key falls back to its default.
  delete: (key: keyof StoreSchema): Promise<void> => ipcRenderer.invoke('store:delete', key)
}

// Document files. Open and Save As resolve to null when the user cancels the
// dialog.
const files = {
  open: (): Promise<OpenedFile | null> => ipcRenderer.invoke('file:open'),
  save: (path: string, contents: string): Promise<void> => ipcRenderer.invoke('file:save', path, contents),
  saveAs: (suggestedName: string, contents: string): Promise<string | null> =>
    ipcRenderer.invoke('file:save-as', suggestedName, contents),
  // Renames the file in its folder; resolves to its new path.
  rename: (path: string, name: string): Promise<string> => ipcRenderer.invoke('file:rename', path, name),
  confirmClose: (title: string): Promise<CloseChoice> => ipcRenderer.invoke('file:confirm-close', title),
  showError: (message: string, detail: string): Promise<void> =>
    ipcRenderer.invoke('file:show-error', message, detail)
}

const menu = {
  // Returns the unsubscribe, so an effect can hand it straight back as its
  // cleanup.
  onCommand: (listener: (command: MenuCommand) => void): (() => void) => {
    const handler = (_event: IpcRendererEvent, command: MenuCommand) => listener(command)
    ipcRenderer.on('menu:command', handler)
    return () => ipcRenderer.removeListener('menu:command', handler)
  }
}

export type StoreBridge = typeof store
export type FilesBridge = typeof files
export type MenuBridge = typeof menu

contextBridge.exposeInMainWorld('store', store)
contextBridge.exposeInMainWorld('files', files)
contextBridge.exposeInMainWorld('menu', menu)
