import { join } from 'node:path'
import { app, BrowserWindow } from 'electron'
import { registerStoreIpc } from './store'

function createWindow(): void {
  // Deliberately a stock window: the OS draws the title bar, the frame, the
  // corners and the window controls, and the renderer only fills what is left.
  const window = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: { preload: join(__dirname, '../preload/index.js') }
  })

  window.on('ready-to-show', () => window.show())

  if (process.env.ELECTRON_RENDERER_URL) {
    window.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  registerStoreIpc()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
