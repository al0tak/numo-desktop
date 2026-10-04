import { useNavigate, useParams } from '@tanstack/react-router'
import { fileNameProblem } from '../../../shared/files'
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
  // Renames the document's file on disk, or names a never-saved one ahead of
  // its first save.
  renameDocument: (id: string, name: string) => Promise<void>
  closeDocument: (id: string) => Promise<void>
}

// What the menu, the home page and the tab bar do with documents. Each action
// is the whole user-facing operation: the native dialogs, the file I/O, and
// moving to the tab it concerns.
export function useDocumentActions(): DocumentActions {
  const documents = useDocuments()
  const navigate = useNavigate()
  const activeId = useParams({ strict: false }).documentId

  const showDocument = (documentId: string) => navigate({ to: '/editor/$documentId', params: { documentId } })

  const newDocument = () => {
    void showDocument(documents.addDocument(createMockInvoiceDocument()))
  }

  const openDocument = async () => {
    const file = await window.files.open()
    if (!file) return

    // A file that is already open is shown rather than opened a second time,
    // which would leave two tabs editing it against each other.
    const existing = documents.documents.find((open) => open.filePath === file.path)
    if (existing) {
      void showDocument(existing.id)
      return
    }

    try {
      const document = parseDocumentFile(file.contents)
      void showDocument(documents.addDocument(document, file.path))
    } catch (error) {
      await window.files.showError(`“${file.path}” could not be opened.`, errorMessage(error))
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
      await window.files.showError(`“${documentTitle(open)}” could not be saved.`, errorMessage(error))
      return false
    }
  }

  const renameDocument = async (id: string, name: string) => {
    const open = documents.documents.find((candidate) => candidate.id === id)
    if (!open || name === documentTitle(open)) return

    const problem = fileNameProblem(name)
    if (problem) {
      await window.files.showError(`“${documentTitle(open)}” could not be renamed.`, problem)
      return
    }

    if (!open.filePath) {
      documents.setDraftName(id, name)
      return
    }

    try {
      documents.setFilePath(id, await window.files.rename(open.filePath, name))
    } catch (error) {
      await window.files.showError(`“${documentTitle(open)}” could not be renamed.`, errorMessage(error))
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

    // Closing the tab on screen moves to its neighbour, the one to the right
    // where there is one, the way native tab bars do. Home is where the last
    // one leaves you.
    //
    // The tab only goes once the move has rendered: closed any sooner, the
    // editor would still be on a route whose document is gone, which it
    // answers by going home.
    if (id === activeId) {
      const list = documents.documents
      const index = list.findIndex((candidate) => candidate.id === id)
      const next = list[index + 1] ?? list[index - 1]
      await (next ? showDocument(next.id) : navigate({ to: '/' }))
    }

    documents.closeDocument(id)
  }

  return { activeId, newDocument, openDocument, saveDocument, renameDocument, closeDocument }
}

// What went wrong, fit for the error sheet. An error thrown in the main process
// reaches the renderer wrapped in Electron's account of the IPC call that
// carried it, which is noise to the user, so only the original message is kept.
function errorMessage(error: unknown): string {
  return (error as Error).message.replace(/^Error invoking remote method '[^']*': (\w*Error: )?/, '')
}
