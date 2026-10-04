import { useEffect, useEffectEvent } from 'react'
import type { MenuCommand } from '../../shared/files'
import { useSidebar } from './components/primitives/Sidebar'
import { useDocumentActions } from './lib/documentActions'

// Carries out the application menu's commands — and so its shortcuts — in
// this window. Renders nothing.
export function MenuCommands() {
  const { activeId, newDocument, openDocument, saveDocument, closeDocument } = useDocumentActions()
  const { toggleSidebar } = useSidebar()

  // An effect event, so the one subscription made on mount always runs against
  // this render's tabs instead of the ones there were when it subscribed.
  const handleCommand = useEffectEvent((command: MenuCommand) => {
    switch (command) {
      case 'new':
        newDocument()
        break
      case 'open':
        void openDocument()
        break
      case 'save':
      case 'save-as':
        if (activeId) void saveDocument(activeId, { as: command === 'save-as' })
        break
      case 'close-tab':
        // With no tab left to close, ⌘W falls back to what it does in any
        // other window.
        if (activeId) void closeDocument(activeId)
        else window.close()
        break
      case 'toggle-sidebar':
        toggleSidebar()
        break
    }
  })

  useEffect(() => window.menu.onCommand(handleCommand), [])

  return null
}
