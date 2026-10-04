import { startTransition } from 'react'
import { useMatch, useNavigate } from 'react-router'
import { parseDocumentFile, serializeDocument } from './documentFile'
import { documentTitle, hasUnsavedChanges, useDocuments } from './documents'
import { createMockInvoiceDocument } from './invoice'

export type DocumentActions = {
  // The tab on screen, or undefined on the home page.
  activeId: string | undefined
  newDocument: () => void
  openDocument: () => Promise<void>
  // Resolves to whether the document ended up on disk — false when the user
  // backed out of the save dialog or the write failed.
  saveDocument: (id: string, options?: { as?: boolean }) => Promise<boolean>
  closeDocument: (id: string) => Promise<void>
}

// What the menu, the home page and the tab bar do with documents. Each action
// is the whole user-facing operation: the native dialogs, the file I/O, and
// moving to the tab it concerns.
export function useDocumentActions(): DocumentActions {
  const documents = useDocuments()
  const navigate = useNavigate()
  const activeId = useMatch('/editor/:documentId')?.params.documentId

  const newDocument = () => {
    navigate(`/editor/${documents.addDocument(createMockInvoiceDocument())}`)
  }

  const openDocument = async () => {
    const file = await window.files.open()
    if (!file) return

    // A file that is already open is shown rather than opened a second time,
    // which would leave two tabs editing it against each other.
    const existing = documents.documents.find((open) => open.filePath === file.path)
    if (existing) {
      navigate(`/editor/${existing.id}`)
      return
    }

    try {
      const document = parseDocumentFile(file.contents)
      navigate(`/editor/${documents.addDocument(document, file.path)}`)
    } catch (error) {
      await window.files.showError(`“${file.path}” could not be opened.`, (error as Error).message)
    }
  }

  const saveDocument = async (id: string, { as = false } = {}) => {
    const open = documents.documents.find((candidate) => candidate.id === id)
    if (!open) return false

    // Captured before the write: edits made while the dialog is up belong to
    // the next save, and must still read as unsaved afterwards.
    const { document } = open
    const contents = serializeDocument(document)

    try {
      if (open.filePath && !as) {
        await window.files.save(open.filePath, contents)
        documents.markSaved(id, open.filePath, document)
        return true
      }

      const filePath = await window.files.saveAs(documentTitle(open), contents)
      if (!filePath) return false

      documents.markSaved(id, filePath, document)
      return true
    } catch (error) {
      await window.files.showError(`“${documentTitle(open)}” could not be saved.`, (error as Error).message)
      return false
    }
  }

  const closeDocument = async (id: string) => {
    const open = documents.documents.find((candidate) => candidate.id === id)
    if (!open) return

    if (hasUnsavedChanges(open)) {
      const choice = await window.files.confirmClose(documentTitle(open))
      if (choice === 'cancel') return
      if (choice === 'save' && !(await saveDocument(id))) return
    }

    // One transition for both: the router applies navigation as a transition,
    // and a close rendered ahead of it would leave the editor on a route whose
    // document is gone, which it answers by going home.
    startTransition(() => {
      // Closing the tab on screen moves to its neighbour, the one to the right
      // where there is one, the way native tab bars do. Home is where the last
      // one leaves you.
      if (id === activeId) {
        const list = documents.documents
        const index = list.findIndex((candidate) => candidate.id === id)
        const next = list[index + 1] ?? list[index - 1]
        navigate(next ? `/editor/${next.id}` : '/home')
      }

      documents.closeDocument(id)
    })
  }

  return { activeId, newDocument, openDocument, saveDocument, closeDocument }
}
