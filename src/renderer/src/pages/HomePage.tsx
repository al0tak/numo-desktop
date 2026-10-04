import { FilePlus2, FolderOpen } from 'lucide-react'
import { HomePageButton } from '../components/HomePageButton'
import { ThemeToggleButton } from '../components/ThemeToggleButton'
import { useDocumentActions } from '../lib/documentActions'
import styles from './HomePage.module.css'

export function HomePage() {
  const { newDocument, openDocument } = useDocumentActions()

  return (
    <div className={styles.home}>
      <HomePageButton icon={<FilePlus2 size={24} strokeWidth={2} />} onClick={newDocument}>
        New invoice
      </HomePageButton>
      <HomePageButton icon={<FolderOpen size={24} strokeWidth={2} />} onClick={() => void openDocument()}>
        Open…
      </HomePageButton>
      <ThemeToggleButton />
    </div>
  )
}
