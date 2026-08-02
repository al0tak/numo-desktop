import { useState } from 'react'
import { DocumentPage } from '../components/DocumentPage'
import { EditorView } from '../components/EditorView'
import { InvoiceView } from '../components/InvoiceView'
import { PageSidebar } from '../components/PageSidebar'
import { PropertyInspector } from '../components/PropertyInspector'
import { createInvoiceDocument } from '../lib/invoice'
import type { InvoiceSelection } from '../lib/invoice'
import styles from './EditorPage.module.css'

// Holds the document being edited and what is selected in it — the page is
// where the canvas and the sidebar meet, and both are views of the same two
// pieces of state.
export function EditorPage() {
  const [invoice, setInvoice] = useState(createInvoiceDocument)
  const [selection, setSelection] = useState<InvoiceSelection>('document')

  return (
    <div className={styles.editor}>
      {/* Clicking past the invoice deselects, which is the same thing as
          selecting the document — elements stop the click before it gets here. */}
      <EditorView onClick={() => setSelection('document')}>
        <DocumentPage width={invoice.width} height={invoice.height}>
          <InvoiceView
            invoice={invoice}
            selection={selection}
            onSelect={setSelection}
            onChange={setInvoice}
          />
        </DocumentPage>
      </EditorView>
      <PageSidebar className={styles.sidebar}>
        <PropertyInspector invoice={invoice} selection={selection} onChange={setInvoice} />
      </PageSidebar>
    </div>
  )
}
