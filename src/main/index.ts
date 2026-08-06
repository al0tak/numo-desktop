import { join } from 'node:path'
import { app, BrowserWindow } from 'electron'
import { registerStoreIpc } from './store'

function createWindow(): void {
  // The title bar is the one piece of chrome we take over: the OS still draws
  // the frame, the corners and the window controls, but the renderer extends
  // under them and provides its own drag strip (.titlebar in index.css).
  const window = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    titleBarStyle: 'hidden',
    // Vertically centred in the --titlebar-height strip the renderer keeps
    // clear; x is the same inset macOS uses on a stock window.
    trafficLightPosition: { x: 20, y: 16 },
    // Windows and Linux have no traffic lights, so Electron draws the native
    // controls over the strip instead. A transparent background lets whichever
    // theme the renderer is in show through, which a fixed colour would not.
    titleBarOverlay: { color: 'rgba(0, 0, 0, 0)', symbolColor: '#808080', height: 48 },
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
