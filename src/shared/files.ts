// What crosses the bridge between the renderer and the main process for
// document files. The file's contents travel as text; only the renderer knows
// what is inside.

export type OpenedFile = {
  path: string
  contents: string
}

// The answer to "save before closing?" — the three buttons of that dialog.
export type CloseChoice = 'save' | 'discard' | 'cancel'

// Commands the application menu sends to the window it is acting on. The
// menu owns the shortcuts, so these arrive whether they were clicked or typed.
export type MenuCommand = 'new' | 'open' | 'save' | 'save-as' | 'close-tab' | 'toggle-sidebar'
