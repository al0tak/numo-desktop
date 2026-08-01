import { HashRouter, Navigate, Route, Routes } from 'react-router'
import EditorPage from './pages/EditorPage'
import HomePage from './pages/HomePage'

// Hash routing: the packaged app is loaded from file://, where path-based
// routing has no server to fall back on.
export default function MainRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </HashRouter>
  )
}
