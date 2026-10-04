import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemTitle } from '../primitives/Item'
import { PAGE_FORMATS } from '../../lib/invoice'
import { useDocumentPane } from './context'
import { HEADING, PAGE } from './styles'

// The root: what there is to set about the document, one row per group, each
// row showing the group's current value so the root reads as a summary too.
export function DocumentPage() {
  const { invoice } = useDocumentPane()
  const formatLabel = invoice.format === 'custom' ? 'Custom' : PAGE_FORMATS[invoice.format].label

  return (
    <div className={PAGE}>
      <h2 className={HEADING}>Document</h2>
      {/* Pulled out to a gap short of the panel's edges — the same gap the tabs
          keep from the editor — so a row's hover reaches past the column of
          text while the text itself stays on the column's edge. */}
      <nav className="mx-[calc(var(--gap)-var(--pane-padding))] flex flex-col" aria-label="Document settings">
        {/* A row that opens a page: the group's name, its current value, and a
            chevron saying it goes somewhere. */}
        <Item
          asChild
          size="sm"
          className="h-(--control-height) flex-nowrap gap-2 px-[calc(var(--pane-padding)-var(--gap))] py-0 [a]:hover:bg-accent"
        >
          <Link to="/format">
            <ItemContent className="flex-none">
              <ItemTitle className="font-normal">Format</ItemTitle>
            </ItemContent>
            <ItemActions className="min-w-0 flex-1 justify-end text-muted-foreground">
              <span className="truncate">
                {formatLabel} · {invoice.width} × {invoice.height} mm
              </span>
              <ChevronRight className="size-3.5 flex-none" aria-hidden="true" />
            </ItemActions>
          </Link>
        </Item>
      </nav>
    </div>
  )
}
