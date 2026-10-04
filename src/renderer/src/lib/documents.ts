import { createContext, useContext } from 'react'
import type { InvoiceDocument } from './invoice'

// A document open in a tab. The id is the tab's, not the document's — it lives
// for as long as the tab does and is what the editor's route points at.
export type OpenDocument = {
  id: string
  document: InvoiceDocument
}

export type DocumentsContextValue = {
  // In tab order, left to right.
  documents: OpenDocument[]
  // Opens a fresh document in a new tab at the end and returns its id.
  openDocument: () => string
  updateDocument: (id: string, document: InvoiceDocument) => void
  closeDocument: (id: string) => void
}

export const DocumentsContext = createContext<DocumentsContextValue | null>(null)

export function useDocuments(): DocumentsContextValue {
  const context = useContext(DocumentsContext)
  if (!context) throw new Error('useDocuments must be used inside a DocumentsProvider')
  return context
}
