import { MainRouter } from './MainRouter'

export function App() {
  return (
    <div className="app">
      <header className="titlebar" />
      <main className="content">
        <MainRouter />
      </main>
    </div>
  )
}
