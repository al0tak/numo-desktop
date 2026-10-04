import { X } from 'lucide-react'
import { NavLink } from 'react-router'
import { Button } from '../primitives/Button'
import { cn } from 'cn'

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
    // Opts out of the bar's drag region as a whole, so no part of a tab drags
    // the window instead of selecting it. A fixed width, so a tab never changes
    // size with its title — a long title truncates.
    //
    // --tab-background is the tab's colour in each state, kept in a property so
    // the close button can fade the title out into whatever the tab is showing.
    <div
      className={cn(
        'group/tab relative flex h-(--tab-height) w-45 flex-none items-center rounded-md bg-(--tab-background) px-0.5 text-sm text-muted-foreground transition-colors app-region-no-drag',
        isActive
          ? 'text-foreground [--tab-background:var(--accent-active)]'
          : '[--tab-background:var(--surface)] hover:[--tab-background:var(--accent)]'
      )}
    >
      {/* The title takes the whole tab; the close button floats over its end.
          The tab on screen reads a step heavier than the ones behind it. */}
      <NavLink
        className={cn(
          'min-w-0 flex-1 cursor-default truncate rounded-md px-1.5 leading-(--tab-height) focus-visible:outline-3 focus-visible:-outline-offset-1 focus-visible:outline-ring',
          isActive && 'font-semibold'
        )}
        to={to}
        title={title}
      >
        {title}
      </NavLink>
      {/* Over the end of the title rather than beside it, so the title has the
          whole tab while the button is hidden. A gradient ahead of it fades the
          title out instead of cutting a letter in half.

          Always shown on the tab on screen, and on any tab with unsaved changes.
          The others show it only while pointed at or holding keyboard focus,
          the way a native tab bar does, so a row of background tabs reads as a
          row of titles. */}
      <Button
        variant="ghost"
        size="icon-xs"
        className={cn(
          'group/close absolute inset-y-0 right-1.25 my-auto size-4.5 rounded-sm bg-(--tab-background) text-current',
          'hover:bg-[color-mix(in_srgb,var(--foreground)_10%,var(--tab-background))] hover:text-current dark:hover:bg-[color-mix(in_srgb,var(--foreground)_10%,var(--tab-background))]',
          'before:pointer-events-none before:absolute before:top-0 before:right-full before:h-full before:w-6 before:bg-linear-to-r before:from-transparent before:to-(--tab-background)',
          isActive || hasUnsavedChanges
            ? 'inline-flex'
            : 'hidden group-focus-within/tab:inline-flex group-hover/tab:inline-flex'
        )}
        aria-label={hasUnsavedChanges ? `Close ${title}, unsaved changes` : `Close ${title}`}
        onClick={onClose}
      >
        {/* Pointing at the button itself — not just the tab — or reaching it by
            keyboard brings the cross back, since closing is what a press does. */}
        {hasUnsavedChanges && (
          <span
            className="size-2 rounded-full bg-current group-hover/close:hidden group-focus-visible/close:hidden"
            aria-hidden="true"
          />
        )}
        <X
          className={cn(
            'size-3',
            hasUnsavedChanges && 'hidden group-hover/close:block group-focus-visible/close:block'
          )}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </Button>
    </div>
  )
}
