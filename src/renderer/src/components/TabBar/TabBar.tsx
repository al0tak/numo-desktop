import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { House } from 'lucide-react'
import { DocumentTab } from '../DocumentTab'
import { useDocumentActions } from '../../lib/documentActions'
import { documentTitle, hasUnsavedChanges, useDocuments } from '../../lib/documents'

export type TabBarProps = {
  className?: string
}

// The strip across the top of the window: home first, then a tab for every open
// document. Which tab is shown is the route's business — the bar only reads it
// back, so the URL stays the one source of truth for what is on screen.
//
// The window's drag strip as well as its tab bar: with the OS title bar hidden
// this is what the window is dragged by, so the bar drags and only the tabs and
// the home button opt out. The macOS window controls sit at its left end, so
// the home button starts clear of them by the same --gap that separates every
// item in the row, so the lights read as one more of them.
//
// Items are a gap short of the bar at the top and at the bottom, and a hairline
// along its bottom edge parts it from the editor under it.
export function TabBar({ className }: TabBarProps) {
  const { documents } = useDocuments()
  const { activeId, closeDocument } = useDocumentActions()

  return (
    <header
      className={cn(
        'flex h-(--titlebar-height) items-center gap-(--gap) border-b bg-surface pr-2.5 pl-[calc(var(--traffic-lights-end)+var(--gap))] select-none app-region-drag [--tab-height:calc(var(--titlebar-height)-2*var(--gap))]',
        className
      )}
    >
      {/* Wider than it is tall, so it reads as a tab of its own at the head of
          the row rather than as a square button beside it. Link marks the
          route on screen with aria-current, which is what the active look keys
          off rather than a class of our own. */}
      <Link
        to="/"
        className="inline-flex h-(--tab-height) w-[calc(var(--tab-height)*1.4)] flex-none cursor-default items-center justify-center rounded-md text-muted-foreground transition-colors app-region-no-drag hover:bg-accent focus-visible:outline-3 focus-visible:-outline-offset-1 focus-visible:outline-ring aria-[current=page]:bg-accent-active aria-[current=page]:text-foreground"
        aria-label="Home"
        title="Home"
      >
        <House className="size-4" strokeWidth={2} aria-hidden="true" />
      </Link>
      {/* The tabs do not drag, but the bar's empty space after the last one
          does — that is the region left for moving the window. */}
      <nav className="flex min-w-0 items-center gap-(--gap)" aria-label="Open documents">
        {documents.map((open) => (
          <DocumentTab
            key={open.id}
            title={documentTitle(open)}
            documentId={open.id}
            isActive={open.id === activeId}
            hasUnsavedChanges={hasUnsavedChanges(open)}
            onClose={() => void closeDocument(open.id)}
          />
        ))}
      </nav>
    </header>
  )
}
