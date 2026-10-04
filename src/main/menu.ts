import { BrowserWindow, Menu } from 'electron'
import type { MenuItemConstructorOptions } from 'electron'
import type { MenuCommand } from '../shared/files'

// The application menu. Keyboard shortcuts live here as menu accelerators
// rather than as keydown listeners in the page: the OS shows them next to each
// command, they work wherever focus is in the window, and they are the same
// whether the command is clicked or typed.
//
// Everything but File and View is the platform's own stock menu, by role.
export function installApplicationMenu(): void {
  const isMac = process.platform === 'darwin'

  const template: MenuItemConstructorOptions[] = [
    ...(isMac ? [{ role: 'appMenu' as const }] : []),
    {
      label: 'File',
      submenu: [
        command('New', 'CmdOrCtrl+N', 'new'),
        command('Open…', 'CmdOrCtrl+O', 'open'),
        { type: 'separator' },
        command('Save', 'CmdOrCtrl+S', 'save'),
        command('Save As…', 'Shift+CmdOrCtrl+S', 'save-as'),
        { type: 'separator' },
        // Takes ⌘W from the window: closing a tab is what it means in a tabbed
        // editor. The window still closes from its own button.
        command('Close Tab', 'CmdOrCtrl+W', 'close-tab'),
        ...(isMac ? [] : [{ type: 'separator' as const }, { role: 'quit' as const }])
      ]
    },
    { role: 'editMenu' },
    {
      // The stock View menu's items, by role, under the app's own command.
      label: 'View',
      submenu: [
        command('Toggle Sidebar', 'CmdOrCtrl+B', 'toggle-sidebar'),
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    { role: 'windowMenu' }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function command(label: string, accelerator: string, name: MenuCommand): MenuItemConstructorOptions {
  return {
    label,
    accelerator,
    click: (_item, window) => {
      if (window instanceof BrowserWindow) window.webContents.send('menu:command', name)
    }
  }
}
