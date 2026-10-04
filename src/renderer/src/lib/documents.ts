import { createContext, useContext } from 'react'
import type { InvoiceDocument } from './invoice'

// A document open in a tab. The id is the tab's, not the document's — it lives
// for as long as the tab does and is what the editor's route points at.
export type OpenDocument = {
  id: string
  document: InvoiceDocument
  // Where the document is saved, or null for one that never has been.
  filePath: string | null
  // The document as it was last written to (or read from) its file. Edits make
  // new document objects, so the tab is unsaved whenever the two differ.
  savedDocument: InvoiceDocument | null
}

export type DocumentsContextValue = {
  // In tab order, left to right.
  documents: OpenDocument[]
  // Adds a tab at the end and returns its id: a new, never-saved document when
  // there is no file, or one just read from `filePath`.
  addDocument: (document: InvoiceDocument, filePath?: string) => string
  updateDocument: (id: string, document: InvoiceDocument) => void
  // Records that `document` — the version that was written, which edits made
  // during the write may have moved on from — is now what is on disk.
  markSaved: (id: string, filePath: string, document: InvoiceDocument) => void
  closeDocument: (id: string) => void
}

export const DocumentsContext = createContext<DocumentsContextValue | null>(null)

export function useDocuments(): DocumentsContextValue {
  const context = useContext(DocumentsContext)
  if (!context) throw new Error('useDocuments must be used inside a DocumentsProvider')
  return context
}

// What the tab is called: the file's name, the way a native editor names a
// document. Untitled until it is saved somewhere.
export function documentTitle({ filePath }: OpenDocument): string {
  if (!filePath) return 'Untitled'

  const fileName = filePath.split(/[\\/]/).pop() ?? filePath
  return fileName.replace(/\.numo$/i, '')
}

// A never-saved document counts as unsaved from the start, the way VS Code
// marks a new untitled file.
export function hasUnsavedChanges({ document, savedDocument }: OpenDocument): boolean {
  return document !== savedDocument
}
