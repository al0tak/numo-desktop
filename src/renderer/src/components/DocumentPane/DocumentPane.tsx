import { useState } from 'react'
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import type { InvoiceDocument } from '../../lib/invoice'
import { DocumentPaneContext } from './context'
import { routeTree } from './routes'

export type DocumentPaneProps = {
  invoice: InvoiceDocument
  onChange: (invoice: InvoiceDocument) => void
}

// What the sidebar shows while the document itself is selected: a small
// navigation stack, the document at its root and a page per group of settings.
//
// It is a router of its own, kept in memory — the pane's place has nothing to
// do with the app's URL, and every pane starts at its root. One per mount, so
// each editor, and each return to the document from an element, starts over.
export function DocumentPane({ invoice, onChange }: DocumentPaneProps) {
  const [router] = useState(createPaneRouter)

  return (
    <DocumentPaneContext value={{ invoice, onChange }}>
      <RouterProvider router={router} />
    </DocumentPaneContext>
  )
}

function createPaneRouter() {
  return createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ['/'] }) })
}

// Types the pane's links against its own routes, so a <Link to> naming a page
// that does not exist fails to compile.
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createPaneRouter>
  }
}
