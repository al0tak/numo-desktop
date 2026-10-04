import { useEffect, useRef } from 'react'
import type { InvoiceDocument, InvoicePartId, InvoiceSelection } from '../../lib/invoice'
import { FormatPage } from './FormatPage'
import { PartPage } from './PartPage'
import { RootPage } from './RootPage'

// Where the sidebar is: the document's root, its format, or the page of one of
// the blocks the invoice is built from.
export type InspectorPage = 'root' | 'format' | InvoicePartId

// What every page is handed: the document, and the way to another page.
export type InspectorPageProps = {
  invoice: InvoiceDocument
  onChange: (invoice: InvoiceDocument) => void
  onNavigate: (page: InspectorPage) => void
}

export type PropertyInspectorProps = InspectorPageProps & {
  page: InspectorPage
  // What is picked on the page, whose field takes the cursor.
  selection: InvoiceSelection
}

// The sidebar's contents: a small stack of pages, the document at its root and
// a page for its format and for each block. Which page is showing is the
// editor's state rather than this component's, since a click on the page moves
// it too — picking an element opens the page of the block it is in.
//
// The page is only ever read from — an element's own text is typed in here.
export function PropertyInspector({ page, selection, ...pageProps }: PropertyInspectorProps) {
  const container = useRef<HTMLDivElement>(null)

  // The page and the sidebar are two views of one thing, so a click on the page
  // finishes here: the field for whatever was clicked takes the cursor, and the
  // click and the typing that follows it are a single move. Only a change of
  // selection moves the cursor — typing re-renders the field without pulling
  // focus back to it.
  useEffect(() => {
    container.current?.querySelector<HTMLElement>(`[data-element="${selection}"]`)?.focus()
  }, [selection])

  return (
    <div ref={container}>
      {page === 'root' && <RootPage {...pageProps} />}
      {page === 'format' && <FormatPage {...pageProps} />}
      {page !== 'root' && page !== 'format' && <PartPage part={page} {...pageProps} />}
    </div>
  )
}
