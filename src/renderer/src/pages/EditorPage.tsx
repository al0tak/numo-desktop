import { Navigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { DocumentNameField } from '../components/DocumentNameField'
import { DocumentPage } from '../components/DocumentPage'
import { EditorView } from '../components/EditorView'
import { InvoiceView } from '../components/InvoiceView'
import { Sidebar, SidebarContent, SidebarHeader } from '../components/primitives/Sidebar'
import { PropertyInspector } from '../components/PropertyInspector'
import type { InspectorPage } from '../components/PropertyInspector'
import { useDocumentActions } from '../lib/documentActions'
import { documentTitle, useDocuments } from '../lib/documents'
import type { OpenDocument } from '../lib/documents'
import { isOnPage, partOf } from '../lib/invoice'
import type { InvoiceSelection } from '../lib/invoice'

// The editor for whichever open document the route names. A tab that has been
// closed, or an id that was never opened, has nothing to show and goes home.
export function EditorPage() {
  const { documentId } = useParams({ from: '/editor/$documentId' })
  const { documents } = useDocuments()
  const open = documents.find(({ id }) => id === documentId)

  if (!open) return <Navigate to="/" replace />

  // Keyed by the tab, so switching tabs starts the editor afresh rather than
  // carrying one document's selection and zoom over to the next.
  return <Editor key={open.id} open={open} />
}

// Holds what is selected in the document and which page the sidebar is on —
// the editor is where the canvas and the sidebar meet, and both are views of
// the document and the selection.
function Editor({ open }: { open: OpenDocument }) {
  const { updateDocument } = useDocuments()
  const { renameDocument } = useDocumentActions()
  const [picked, setPicked] = useState<InvoiceSelection>('document')
  const [page, setPage] = useState<InspectorPage>('root')
  const invoice = open.document

  // A block taken off the page takes whatever was picked in it along, and its
  // page with it, which leaves the document selected and its root showing.
  const selection = isOnPage(invoice, picked) ? picked : 'document'
  const shownPage = page !== 'root' && page !== 'format' && !invoice.parts[page] ? 'root' : page

  // A click on the page picks what it landed on and opens the page of the block
  // it is in. A click past the invoice picks the document: that drops the ring,
  // and returns to the root only from a page the last pick had opened — one
  // reached through the sidebar is left where it is.
  const select = (next: InvoiceSelection) => {
    if (next !== 'document') setPage(partOf(next) ?? 'root')
    else if (selection !== 'document') setPage('root')
    setPicked(next)
  }

  // Moving through the sidebar lets go of whatever was picked on the page,
  // since the page shown is no longer the one it opened.
  const navigate = (next: InspectorPage) => {
    setPicked('document')
    setPage(next)
  }

  // The app's tab bar floats over the first strip and the sidebar takes the
  // left of what is under it. The canvas takes only what is left, so the
  // document is fitted to the part of the window it can actually be seen in.
  // Hairlines under the bar and beside the sidebar part the frame from the
  // canvas.
  return (
    <div className="flex h-full flex-col bg-surface pt-(--titlebar-height)">
      {/* Positioned, because the sidebar is laid out against it. */}
      <div className="relative flex min-h-0 flex-1">
        <Sidebar>
          {/* Above the inspector and outside its pages, so the name stays in
              view whatever is selected and whichever page is showing. Inset
              by the gap rather than the pane's padding, so the name's hover
              reaches past the column of text below it — the field's own inset
              puts the text itself back on that column. */}
          <SidebarHeader className="border-b p-(--gap)">
            <DocumentNameField
              name={documentTitle(open)}
              onRename={(name) => void renameDocument(open.id, name)}
            />
          </SidebarHeader>
          <SidebarContent>
            <PropertyInspector
              invoice={invoice}
              page={shownPage}
              selection={selection}
              onChange={(document) => updateDocument(open.id, document)}
              onNavigate={navigate}
            />
          </SidebarContent>
        </Sidebar>
        {/* Clicking past the invoice deselects, which is the same thing as
            selecting the document — elements stop the click before it gets
            here. */}
        <EditorView className="min-w-0 flex-1" onClick={() => select('document')}>
          <DocumentPage width={invoice.width} height={invoice.height}>
            <InvoiceView invoice={invoice} selection={selection} onSelect={select} />
          </DocumentPage>
        </EditorView>
      </div>
    </div>
  )
}
