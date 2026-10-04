import type { CSSProperties } from 'react'
import { HashRouter } from 'react-router'
import { SidebarProvider } from './components/primitives/Sidebar'
import { TabBar } from './components/TabBar'
import { DocumentsProvider } from './DocumentsProvider'
import { MainRouter } from './MainRouter'
import { MenuCommands } from './MenuCommands'

// Hash routing: the packaged app is loaded from file://, where path-based
// routing has no server to fall back on. The router wraps the tab bar as well
// as the pages, since the bar is what navigates between them.
//
// The sidebar's state lives up here rather than in the editor: the menu is what
// toggles it, and it stays as it was left when switching between tabs.
//
// One cell holding both children: the tab bar floats over the content instead
// of stacking above it, so a page's panels still run the full height of the
// client area and pass under the window controls. The bar sits above the
// content, whose own layers (the editor's sidebar) would otherwise cover it.
export function App() {
  return (
    <HashRouter>
      <DocumentsProvider>
        <SidebarProvider
          className="grid h-full grid-cols-1 grid-rows-1"
          style={{ '--sidebar-width': '280px' } as CSSProperties}
        >
          <MenuCommands />
          <TabBar className="z-20 col-start-1 row-start-1 self-start" />
          <main className="col-start-1 row-start-1 overflow-auto">
            <MainRouter />
          </main>
        </SidebarProvider>
      </DocumentsProvider>
    </HashRouter>
  )
}
