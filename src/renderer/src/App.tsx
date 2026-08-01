import MainRouter from './MainRouter'

export default function App() {
  return (
    <div className="app">
      <header className="titlebar" />
      <main className="content">
        <MainRouter />
      </main>
    </div>
  )
}
