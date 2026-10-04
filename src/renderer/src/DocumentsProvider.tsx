import { useState } from 'react'
import type { ReactNode } from 'react'
import { DocumentsContext } from './lib/documents'
import type { OpenDocument } from './lib/documents'
import { createMockInvoiceDocument } from './lib/invoice'
import type { InvoiceDocument } from './lib/invoice'

// Holds every document open in a tab. It sits above the router so the tab bar
// and the editor read the same list, and a document outlives its editor being
// unmounted when another tab is shown.
//
// Nothing here is persisted yet: closing a tab or the window discards the
// document.
export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<OpenDocument[]>([])

  const openDocument = () => {
    const id = crypto.randomUUID()
    setDocuments((current) => [...current, { id, document: createMockInvoiceDocument() }])
    return id
  }

  const updateDocument = (id: string, document: InvoiceDocument) => {
    setDocuments((current) => current.map((open) => (open.id === id ? { id, document } : open)))
  }

  const closeDocument = (id: string) => {
    setDocuments((current) => current.filter((open) => open.id !== id))
  }

  return (
    <DocumentsContext value={{ documents, openDocument, updateDocument, closeDocument }}>
      {children}
    </DocumentsContext>
  )
}
