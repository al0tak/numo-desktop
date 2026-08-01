import { join } from 'node:path'
import { app, BrowserWindow } from 'electron'

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false
  })

  window.on('ready-to-show', () => window.show())

  if (process.env.ELECTRON_RENDERER_URL) {
    window.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
