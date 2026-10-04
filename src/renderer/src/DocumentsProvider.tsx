import { useState } from 'react'
import type { ReactNode } from 'react'
import { DocumentsContext } from './lib/documents'
import type { OpenDocument } from './lib/documents'
import type { InvoiceDocument } from './lib/invoice'

// Holds every document open in a tab. It sits above the router so the tab bar
// and the editor read the same list, and a document outlives its editor being
// unmounted when another tab is shown.
//
// This is the state alone. Reading and writing files, and the dialogs around
// them, are in useDocumentActions.
export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<OpenDocument[]>([])

  const addDocument = (document: InvoiceDocument, filePath?: string) => {
    const id = crypto.randomUUID()
    const open: OpenDocument = filePath
      ? { id, document, filePath, draftName: null, savedDocument: document }
      : { id, document, filePath: null, draftName: null, savedDocument: null }

    setDocuments((current) => [...current, open])
    return id
  }

  const updateDocument = (id: string, document: InvoiceDocument) => {
    setDocuments((current) => current.map((open) => (open.id === id ? { ...open, document } : open)))
  }

  const markSaved = (id: string, filePath: string, document: InvoiceDocument) => {
    setDocuments((current) =>
      current.map((open) => (open.id === id ? { ...open, filePath, savedDocument: document } : open))
    )
  }

  const setFilePath = (id: string, filePath: string) => {
    setDocuments((current) => current.map((open) => (open.id === id ? { ...open, filePath } : open)))
  }

  const setDraftName = (id: string, draftName: string) => {
    setDocuments((current) => current.map((open) => (open.id === id ? { ...open, draftName } : open)))
  }

  const closeDocument = (id: string) => {
    setDocuments((current) => current.filter((open) => open.id !== id))
  }

  return (
    <DocumentsContext
      value={{ documents, addDocument, updateDocument, markSaved, setFilePath, setDraftName, closeDocument }}
    >
      {children}
    </DocumentsContext>
  )
}
