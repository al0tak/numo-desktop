import { createContext, useContext } from 'react'
import type { InvoiceDocument } from '../../lib/invoice'

export type DocumentPaneContextValue = {
  invoice: InvoiceDocument
  onChange: (invoice: InvoiceDocument) => void
}

// The document reaches the pane's pages through plain React context rather
// than the router's own context: the router computes its context when it
// matches a route and caches it there, so a document edited since would not
// reach a page that is already showing.
export const DocumentPaneContext = createContext<DocumentPaneContextValue | null>(null)

export function useDocumentPane(): DocumentPaneContextValue {
  const context = useContext(DocumentPaneContext)
  if (!context) throw new Error('useDocumentPane must be used inside a DocumentPane')
  return context
}
