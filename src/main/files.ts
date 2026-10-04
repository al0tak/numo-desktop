import { randomUUID } from 'node:crypto'
import { readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import type { CloseChoice, OpenedFile } from '../shared/files'
import { store } from './store'

const FILE_FILTERS = [{ name: 'Numo invoice', extensions: ['numo'] }]

// Document files on disk, and the native dialogs that pick them. The main
// process only moves text: what the text means — parsing, checking, the
// document inside — is the renderer's business, so this side never has to
// change when the document does.
export function registerFileIpc(): void {
  ipcMain.handle('file:open', async (event): Promise<OpenedFile | null> => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const options = { properties: ['openFile' as const], filters: FILE_FILTERS }
    const result = window
      ? await dialog.showOpenDialog(window, options)
      : await dialog.showOpenDialog(options)
    if (result.canceled || result.filePaths.length === 0) return null

    const path = result.filePaths[0]
    return { path, contents: await readFile(path, 'utf8') }
  })

  ipcMain.handle('file:save', async (_event, path: string, contents: string) => {
    await writeAtomically(path, contents)
  })

  ipcMain.handle('file:save-as', async (event, suggestedName: string, contents: string) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const defaultPath = join(await saveFolder(), `${suggestedName}.numo`)
    const options = { defaultPath, filters: FILE_FILTERS }
    const result = window
      ? await dialog.showSaveDialog(window, options)
      : await dialog.showSaveDialog(options)
    if (result.canceled || !result.filePath) return null

    await writeAtomically(result.filePath, contents)
    // Remembered only once the file is written, so a save that failed does not
    // send the next one back to a folder that may be the reason it failed.
    store.set('saveFolder', dirname(result.filePath))
    return result.filePath
  })

  // The question a native editor asks before closing a document with unsaved
  // changes, as a sheet on the window it belongs to.
  ipcMain.handle('file:confirm-close', async (event, title: string): Promise<CloseChoice> => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const options = {
      type: 'warning' as const,
      message: `Do you want to save the changes you made to “${title}”?`,
      detail: 'Your changes will be lost if you don’t save them.',
      buttons: ['Save', 'Don’t Save', 'Cancel'],
      defaultId: 0,
      cancelId: 2
    }
    const { response } = window
      ? await dialog.showMessageBox(window, options)
      : await dialog.showMessageBox(options)

    return (['save', 'discard', 'cancel'] as const)[response]
  })

  ipcMain.handle('file:show-error', async (event, message: string, detail: string) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    const options = { type: 'error' as const, message, detail }
    if (window) await dialog.showMessageBox(window, options)
    else await dialog.showMessageBox(options)
  })
}

// Where Save As starts: the folder the last one was saved to, or Documents
// for a first save — and again whenever the remembered folder has since been
// moved, deleted or unmounted, rather than starting the dialog somewhere that
// is not there.
async function saveFolder(): Promise<string> {
  const remembered = store.get('saveFolder')
  if (remembered && (await isDirectory(remembered))) return remembered

  return app.getPath('documents')
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory()
  } catch {
    return false
  }
}

// Written beside the target and renamed over it, so a crash or a full disk
// mid-write leaves the previous file whole instead of half of the new one.
async function writeAtomically(path: string, contents: string): Promise<void> {
  const temporary = join(dirname(path), `.${randomUUID()}.tmp`)

  try {
    await writeFile(temporary, contents, 'utf8')
    await rename(temporary, path)
  } catch (error) {
    await rm(temporary, { force: true })
    throw error
  }
}
