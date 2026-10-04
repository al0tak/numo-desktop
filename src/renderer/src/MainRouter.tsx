import { Navigate, Route, Routes } from 'react-router'
import { EditorPage } from './pages/EditorPage'
import { HomePage } from './pages/HomePage'

export function MainRouter() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/editor/:documentId" element={<EditorPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
