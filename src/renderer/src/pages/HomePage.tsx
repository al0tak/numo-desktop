import { FilePlus2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { HomePageButton } from '../components/HomePageButton'
import { ThemeToggleButton } from '../components/ThemeToggleButton'
import { useDocuments } from '../lib/documents'
import styles from './HomePage.module.css'

export function HomePage() {
  const navigate = useNavigate()
  const { openDocument } = useDocuments()

  return (
    <div className={styles.home}>
      <HomePageButton
        icon={<FilePlus2 size={24} strokeWidth={2} />}
        onClick={() => navigate(`/editor/${openDocument()}`)}
      >
        New invoice
      </HomePageButton>
      <ThemeToggleButton />
    </div>
  )
}
