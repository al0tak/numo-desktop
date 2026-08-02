import { useEffect, useRef } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../lib/cx'
import styles from './EditableText.module.css'

export type EditableTextProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'onChange'> & {
  value: string
  isEditable: boolean
  onChange: (value: string) => void
  // Whether taking the caret is this field's business the moment it becomes
  // editable. True where selecting the element means the user wants to type in
  // exactly this field; false where several fields turn editable at once, such
  // as the cells of the items table, and only one of them could win.
  focusOnEdit?: boolean
}

// One run of the invoice's text, edited where it is printed rather than through
// a field in the sidebar.
//
// The typed text is read back off the DOM on blur instead of on every
// keystroke: React owns this element's children, so a re-render mid-word would
// rewrite the text node the caret sits in and send the caret to the end of it.
// Between focus and blur the DOM is the source of truth, and by the time it is
// handed back the two agree again.
export function EditableText({ value, isEditable, onChange, focusOnEdit = false, className, ...rest }: EditableTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!isEditable || !focusOnEdit || !element) return

    // The click that selected the element landed before it was editable, so it
    // left no caret behind — without this the user would have to click a second
    // time to start typing.
    element.focus()

    const range = document.createRange()
    range.selectNodeContents(element)
    range.collapse(false)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }, [isEditable, focusOnEdit])

  return (
    <div
      ref={ref}
      className={cx(styles.editableText, className)}
      contentEditable={isEditable}
      // React only warns because it cannot see that the children below and the
      // text being edited are the same string.
      suppressContentEditableWarning
      {...rest}
      // innerText rather than textContent: line breaks are typed as elements,
      // and this is the property that reads them back as newlines.
      onBlur={(event) => onChange(event.currentTarget.innerText)}
    >
      {value}
    </div>
  )
}
