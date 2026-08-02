import { join } from 'node:path'
import { app, BrowserWindow } from 'electron'

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    // Hides the OS title bar but keeps the native traffic lights on macOS.
    titleBarStyle: 'hidden',
    // Measured from the sidebar's edge rather than the window's, so this is the
    // 8pt shell inset (--window-padding) plus a 12pt margin inside the panel.
    trafficLightPosition: { x: 20, y: 20 },
    // Native window controls drawn over our own title bar on Windows/Linux.
    titleBarOverlay: { color: '#dddddd', symbolColor: '#333333', height: 48 }
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
