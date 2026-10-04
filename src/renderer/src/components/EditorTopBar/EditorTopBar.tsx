import type { KeyboardEvent } from 'react'
import { cx } from '../../lib/cx'
import styles from './EditorTopBar.module.css'

export type EditorTopBarProps = {
  title: string
  onTitleChange: (title: string) => void
  className?: string
}

// The strip across the top of the editor, holding the document's title.
//
// The title is a plain <input> dressed as a heading, so clicking it to edit,
// selecting, undo and the caret all come from the platform. It is left
// uncontrolled while it has focus and reports once, on blur — the document only
// learns the title when the user is done with it, not on every keystroke.
export function EditorTopBar({ title, onTitleChange, className }: EditorTopBarProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    } else if (event.key === 'Escape') {
      event.currentTarget.value = title
      event.currentTarget.blur()
    }
  }

  return (
    <header className={cx(styles.topBar, className)}>
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
    </header>
  )
}
