import type { ComponentPropsWithRef, MouseEvent } from 'react'
import { cx } from '../../lib/cx'
import styles from './InvoiceElement.module.css'

export type InvoiceElementProps = ComponentPropsWithRef<'div'> & {
  isSelected: boolean
  // Whether this sits inside a group that is a hitbox of its own. The ring
  // around the group is what says a click landed, so a part inside it tints
  // itself instead of drawing a second ring, and leaves hovering to the group
  // as well — the group is the thing being pointed at.
  isPart?: boolean
  onSelect: () => void
}

// A hitbox around one part of the invoice: it adds nothing to the page's layout
// and everything to what can be pointed at. Clicking it selects the part it
// wraps, which is what the sidebar then inspects, and a selected part carries
// the same blue ring the rest of the app uses for focus.
export function InvoiceElement({
  className,
  isSelected,
  isPart,
  onSelect,
  onClick,
  ...rest
}: InvoiceElementProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    // The canvas underneath clears the selection when it is clicked, so a click
    // that landed on an element has to stop before it reaches it.
    event.stopPropagation()
    onSelect()
    onClick?.(event)
  }

  return (
    <div
      className={cx(styles.invoiceElement, isPart && styles.part, isSelected && styles.selected, className)}
      {...rest}
      onClick={handleClick}
    />
  )
}
