import type { ComponentPropsWithRef, MouseEvent } from 'react'
import { cn } from 'cn'

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
      className={cn(
        // Transparent rather than absent, so the ring appearing on hover does not
        // change the box and shift the text under it. The offset is in
        // millimetres like the rest of the page, so it holds its distance from
        // the content at any zoom.
        'rounded-[1mm] outline outline-offset-[1mm] outline-transparent',
        isPart
          ? // The part of a selected group that the click landed on, marked
            // with a wash rather than a ring so it reads as being inside the
            // group's ring and not as a second selection. It is spread past the
            // box by the same millimetre the ring stands off by, so a short run
            // of text is marked as generously as a whole element is.
            isSelected && 'bg-ring/14 shadow-[0_0_0_1mm_color-mix(in_srgb,var(--ring)_14%,transparent)]'
          : isSelected
            ? 'outline-2 outline-ring'
            : 'hover:outline-ring/40',
        className
      )}
      {...rest}
      onClick={handleClick}
    />
  )
}
