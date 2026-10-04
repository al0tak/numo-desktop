import { HashRouter } from 'react-router'
import { TabBar } from './components/TabBar'
import { DocumentsProvider } from './DocumentsProvider'
import { MainRouter } from './MainRouter'

// Hash routing: the packaged app is loaded from file://, where path-based
// routing has no server to fall back on. The router wraps the tab bar as well
// as the pages, since the bar is what navigates between them.
export function App() {
  return (
    <HashRouter>
      <DocumentsProvider>
        <div className="app">
          <TabBar className="titlebar" />
          <main className="content">
            <MainRouter />
          </main>
        </div>
      </DocumentsProvider>
    </HashRouter>
  )
}
