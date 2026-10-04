import { House } from 'lucide-react'
import { NavLink } from 'react-router'
import { DocumentTab } from '../DocumentTab'
import { cx } from '../../lib/cx'
import { useDocumentActions } from '../../lib/documentActions'
import { documentTitle, hasUnsavedChanges, useDocuments } from '../../lib/documents'
import styles from './TabBar.module.css'

export type TabBarProps = {
  className?: string
}

// The strip across the top of the window: home first, then a tab for every open
// document. Which tab is shown is the route's business — the bar only reads it
// back, so the URL stays the one source of truth for what is on screen.
export function TabBar({ className }: TabBarProps) {
  const { documents } = useDocuments()
  const { activeId, closeDocument } = useDocumentActions()

  return (
    <header className={cx(styles.tabBar, className)}>
      <NavLink to="/home" className={styles.home} aria-label="Home" title="Home">
        <House size={16} strokeWidth={2} aria-hidden="true" />
      </NavLink>
      <nav className={styles.tabs} aria-label="Open documents">
        {documents.map((open) => (
          <DocumentTab
            key={open.id}
            title={documentTitle(open)}
            to={`/editor/${open.id}`}
            isActive={open.id === activeId}
            hasUnsavedChanges={hasUnsavedChanges(open)}
            onClose={() => void closeDocument(open.id)}
          />
        ))}
      </nav>
    </header>
  )
}
