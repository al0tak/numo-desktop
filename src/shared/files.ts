// What crosses the bridge between the renderer and the main process for
// document files. The file's contents travel as text; only the renderer knows
// what is inside.

export type OpenedFile = {
  path: string
  contents: string
}

// The answer to "save before closing?" — the three buttons of that dialog.
export type CloseChoice = 'save' | 'discard' | 'cancel'

// Why a document cannot be called `name`, or null when it can. Checked on both
// sides: the renderer answers before anything is renamed, and the main process
// again before it touches the disk.
export function fileNameProblem(name: string): string | null {
  if (name.trim() === '') return 'A file name cannot be empty.'
  if (/[/\\:]/.test(name)) return 'A file name cannot contain “/”, “\\” or “:”.'
  if (name.startsWith('.')) return 'A file name cannot start with “.”, which would hide the file.'
  return null
}

// Commands the application menu sends to the window it is acting on. The
// menu owns the shortcuts, so these arrive whether they were clicked or typed.
export type MenuCommand = 'new' | 'open' | 'save' | 'save-as' | 'close-tab' | 'toggle-sidebar'
