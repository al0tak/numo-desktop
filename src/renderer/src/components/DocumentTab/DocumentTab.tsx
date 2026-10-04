import { X } from 'lucide-react'
import { NavLink } from 'react-router'
import { Button } from '../Button'
import { cx } from '../../lib/cx'
import styles from './DocumentTab.module.css'

export type DocumentTabProps = {
  title: string
  to: string
  isActive: boolean
  hasUnsavedChanges: boolean
  onClose: () => void
}

// One open document in the tab bar: its title and a close button.
//
// The tab is a link to its document — navigation, so the platform's anchor
// gives it focus, Enter and aria-current. The close button is a sibling rather
// than inside it, since a button nested in a link is invalid.
//
// Unsaved changes follow VS Code: the close button shows a dot instead of the
// cross, always, and turns back into the cross only while it is pointed at.
export function DocumentTab({ title, to, isActive, hasUnsavedChanges, onClose }: DocumentTabProps) {
  return (
    <div className={cx(styles.tab, isActive && styles.active, hasUnsavedChanges && styles.unsaved)}>
      <NavLink className={styles.link} to={to} title={title}>
        {title}
      </NavLink>
      <Button
        className={styles.close}
        aria-label={hasUnsavedChanges ? `Close ${title}, unsaved changes` : `Close ${title}`}
        onClick={onClose}
      >
        <span className={styles.dot} aria-hidden="true" />
        <X className={styles.cross} size={12} strokeWidth={2.5} aria-hidden="true" />
      </Button>
    </div>
  )
}
