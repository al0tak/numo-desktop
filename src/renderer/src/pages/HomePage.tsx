import { FilePlus2, FolderOpen } from 'lucide-react'
import { HomePageButton } from '../components/HomePageButton'
import { ThemeToggleButton } from '../components/ThemeToggleButton'
import { useDocumentActions } from '../lib/documentActions'

export function HomePage() {
  const { newDocument, openDocument } = useDocumentActions()

  return (
    <div className="flex min-h-full items-center justify-center gap-4">
      <HomePageButton icon={<FilePlus2 strokeWidth={2} />} onClick={newDocument}>
        New invoice
      </HomePageButton>
      <HomePageButton icon={<FolderOpen strokeWidth={2} />} onClick={() => void openDocument()}>
        Open…
      </HomePageButton>
      <ThemeToggleButton />
    </div>
  )
}
