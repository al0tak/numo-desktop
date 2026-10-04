import { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { DocumentPage } from '../components/DocumentPage'
import { EditorView } from '../components/EditorView'
import { InvoiceView } from '../components/InvoiceView'
import { Sidebar, SidebarContent } from '../components/primitives/Sidebar'
import { PropertyInspector } from '../components/PropertyInspector'
import { useDocuments } from '../lib/documents'
import type { OpenDocument } from '../lib/documents'
import type { InvoiceSelection } from '../lib/invoice'

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

  // The app's tab bar floats over the first strip and the sidebar takes the
  // left of what is under it. The canvas takes only what is left, so the
  // document is fitted to the part of the window it can actually be seen in,
  // and its corner is a corner of its own rather than wherever the panels cover
  // it.
  //
  // The editor wears the panels' surface, so what shows behind the canvas's
  // rounded corner is the same white the bar and the sidebar are made of — the
  // two read as one frame the canvas sits inside.
  return (
    <div className="flex h-full flex-col bg-surface pt-(--titlebar-height)">
      {/* Positioned, because the sidebar is laid out against it. */}
      <div className="relative flex min-h-0 flex-1">
        {/* Flush against the window and with no line on its open edge: the
            canvas beside it has an edge of its own. */}
        <Sidebar className="group-data-[side=left]:border-r-0">
          <SidebarContent>
            <PropertyInspector
              invoice={invoice}
              selection={selection}
              onChange={(document) => updateDocument(open.id, document)}
            />
          </SidebarContent>
        </Sidebar>
        {/* Clicking past the invoice deselects, which is the same thing as
            selecting the document — elements stop the click before it gets
            here. The tabs' radius on its corner, so the frame's one corner
            matches the shapes in it. */}
        <EditorView className="min-w-0 flex-1 rounded-tl-md" onClick={() => setSelection('document')}>
          <DocumentPage width={invoice.width} height={invoice.height}>
            <InvoiceView invoice={invoice} selection={selection} onSelect={setSelection} />
          </DocumentPage>
        </EditorView>
      </div>
    </div>
  )
}
