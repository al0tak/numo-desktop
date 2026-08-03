import type { ComponentPropsWithRef, MouseEvent } from 'react'
import { cx } from '../../lib/cx'
import styles from './InvoiceElement.module.css'

export type InvoiceElementProps = ComponentPropsWithRef<'div'> & {
  isSelected: boolean
  onSelect: () => void
}

// A hitbox around one part of the invoice: it adds nothing to the page's layout
// and everything to what can be pointed at. Clicking it selects the part it
// wraps, which is what the sidebar then inspects, and a selected part carries
// the same blue ring the rest of the app uses for focus.
export function InvoiceElement({ className, isSelected, onSelect, onClick, ...rest }: InvoiceElementProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    // The canvas underneath clears the selection when it is clicked, so a click
    // that landed on an element has to stop before it reaches it.
    event.stopPropagation()
    onSelect()
    onClick?.(event)
  }

  return (
    <div
      className={cx(styles.invoiceElement, isSelected && styles.selected, className)}
      {...rest}
      onClick={handleClick}
    />
  )
}
