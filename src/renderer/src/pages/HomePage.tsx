import { useNavigate } from 'react-router'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <h1>Home</h1>
      <button type="button" onClick={() => navigate('/editor')}>
        Go to editor
      </button>
    </>
  )
}
