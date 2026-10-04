import { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { DocumentPage } from '../components/DocumentPage'
import { EditorView } from '../components/EditorView'
import { InvoiceView } from '../components/InvoiceView'
import { PageSidebar } from '../components/PageSidebar'
import { PropertyInspector } from '../components/PropertyInspector'
import { useDocuments } from '../lib/documents'
import type { OpenDocument } from '../lib/documents'
import type { InvoiceSelection } from '../lib/invoice'
import styles from './EditorPage.module.css'

// The editor for whichever open document the route names. A tab that has been
// closed, or an id that was never opened, has nothing to show and goes home.
export function EditorPage() {
  const { documentId } = useParams()
  const { documents } = useDocuments()
  const open = documents.find(({ id }) => id === documentId)

  if (!open) return <Navigate to="/home" replace />

  // Keyed by the tab, so switching tabs starts the editor afresh rather than
  // carrying one document's selection and zoom over to the next.
  return <Editor key={open.id} open={open} />
}

// Holds what is selected in the document — the page is where the canvas and the
// sidebar meet, and both are views of the document and the selection.
function Editor({ open }: { open: OpenDocument }) {
  const { updateDocument } = useDocuments()
  const [selection, setSelection] = useState<InvoiceSelection>('document')
  const invoice = open.document

  return (
    <div className={styles.editor}>
      {/* Clicking past the invoice deselects, which is the same thing as
          selecting the document — elements stop the click before it gets here. */}
      <EditorView className={styles.canvas} onClick={() => setSelection('document')}>
        <DocumentPage width={invoice.width} height={invoice.height}>
          <InvoiceView invoice={invoice} selection={selection} onSelect={setSelection} />
        </DocumentPage>
      </EditorView>
      <PageSidebar className={styles.sidebar}>
        <PropertyInspector
          invoice={invoice}
          selection={selection}
          onChange={(document) => updateDocument(open.id, document)}
        />
      </PageSidebar>
    </div>
  )
}
