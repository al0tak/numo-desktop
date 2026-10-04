import { startTransition } from 'react'
import { House } from 'lucide-react'
import { NavLink, useMatch, useNavigate } from 'react-router'
import { DocumentTab } from '../DocumentTab'
import { cx } from '../../lib/cx'
import { useDocuments } from '../../lib/documents'
import styles from './TabBar.module.css'

export type TabBarProps = {
  className?: string
}

// The strip across the top of the window: home first, then a tab for every open
// document. Which tab is shown is the route's business — the bar only reads it
// back, so the URL stays the one source of truth for what is on screen.
export function TabBar({ className }: TabBarProps) {
  const { documents, updateDocument, closeDocument } = useDocuments()
  const navigate = useNavigate()
  const activeId = useMatch('/editor/:documentId')?.params.documentId

  const handleClose = (id: string) => {
    // One transition for both: the router applies navigation as a transition,
    // and a close rendered ahead of it would leave the editor on a route whose
    // document is gone, which it answers by going home.
    startTransition(() => {
      // Closing the tab on screen moves to its neighbour, the one to the right
      // where there is one, the way native tab bars do. Home is where the last
      // one leaves you.
      if (id === activeId) {
        const index = documents.findIndex((open) => open.id === id)
        const next = documents[index + 1] ?? documents[index - 1]
        navigate(next ? `/editor/${next.id}` : '/home')
      }

      closeDocument(id)
    })
  }

  return (
    <header className={cx(styles.tabBar, className)}>
      <NavLink to="/home" className={styles.home} aria-label="Home" title="Home">
        <House size={16} strokeWidth={2} aria-hidden="true" />
      </NavLink>
      <nav className={styles.tabs} aria-label="Open documents">
        {documents.map(({ id, document }) => (
          <DocumentTab
            key={id}
            title={document.title}
            to={`/editor/${id}`}
            isActive={id === activeId}
            onTitleChange={(title) => updateDocument(id, { ...document, title })}
            onClose={() => handleClose(id)}
          />
        ))}
      </nav>
    </header>
  )
}
