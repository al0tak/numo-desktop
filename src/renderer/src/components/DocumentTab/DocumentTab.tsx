import type { KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { NavLink } from 'react-router'
import { Button } from '../Button'
import { cx } from '../../lib/cx'
import styles from './DocumentTab.module.css'

export type DocumentTabProps = {
  title: string
  to: string
  isActive: boolean
  onTitleChange: (title: string) => void
  onClose: () => void
}

// One open document in the tab bar: its title and a close button.
//
// An inactive tab is a link to its document — navigation, so the platform's
// anchor gives it focus, Enter and aria-current. The active tab swaps the link
// for the title field, since the only thing left to do with a tab already shown
// is rename it.
//
// The title is a plain <input> dressed as a label, so clicking it to edit,
// selecting, undo and the caret all come from the platform. It is left
// uncontrolled while it has focus and reports once, on blur — the document only
// learns the title when the user is done with it, not on every keystroke.
export function DocumentTab({ title, to, isActive, onTitleChange, onClose }: DocumentTabProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    } else if (event.key === 'Escape') {
      event.currentTarget.value = title
      event.currentTarget.blur()
    }
  }

  return (
    <div className={cx(styles.tab, isActive && styles.active)}>
      {isActive ? (
        <input
          // Remounted whenever the title changes from outside, so the field never
          // shows a value the document has moved on from.
          key={title}
          className={styles.title}
          defaultValue={title}
          aria-label="Document title"
          spellCheck={false}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            const value = event.currentTarget.value.trim()

            // A document always has a title, so clearing it puts the old one back.
            if (!value) {
              event.currentTarget.value = title
              return
            }

            if (value !== title) onTitleChange(value)
          }}
        />
      ) : (
        <NavLink className={styles.link} to={to} title={title}>
          {title}
        </NavLink>
      )}
      <Button className={styles.close} aria-label={`Close ${title}`} onClick={onClose}>
        <X size={12} strokeWidth={2.5} aria-hidden="true" />
      </Button>
    </div>
  )
}
