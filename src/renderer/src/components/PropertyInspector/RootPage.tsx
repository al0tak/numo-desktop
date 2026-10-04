import { cn } from 'cn'
import { ChevronRight } from 'lucide-react'
import { Checkbox } from '../primitives/Checkbox'
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '../primitives/Item'
import { Separator } from '../primitives/Separator'
import { INVOICE_PARTS, PAGE_FORMATS } from '../../lib/invoice'
import type { InvoicePartId } from '../../lib/invoice'
import type { InspectorPageProps } from './PropertyInspector'
import { PAGE, ROW, ROWS } from './styles'

// The root: what there is to set about the document, then the blocks the page
// is built from. Each row opens a page; the format's row shows its current
// value, so the root reads as a summary too.
export function RootPage({ invoice, onChange, onNavigate }: InspectorPageProps) {
  const formatLabel = invoice.format === 'custom' ? 'Custom' : PAGE_FORMATS[invoice.format].label

  const setPart = (part: InvoicePartId, isOn: boolean) => {
    onChange({ ...invoice, parts: { ...invoice.parts, [part]: isOn } })
  }

  return (
    <div className={PAGE}>
      <nav className={ROWS} aria-label="Document settings">
        {/* A row that opens a page: the group's name, its current value, and a
            chevron saying it goes somewhere. */}
        <Item asChild size="sm" className={cn(ROW, 'w-full text-left hover:bg-accent')}>
          <button type="button" onClick={() => onNavigate('format')}>
            <ItemContent className="flex-none">
              <ItemTitle className="font-normal">Format</ItemTitle>
            </ItemContent>
            <ItemActions className="min-w-0 flex-1 justify-end text-muted-foreground">
              <span className="truncate">
                {formatLabel} · {invoice.width} × {invoice.height} mm
              </span>
              <ChevronRight className="size-3.5 flex-none" aria-hidden="true" />
            </ItemActions>
          </button>
        </Item>
      </nav>

      {/* Across the whole panel, like the line under the document's name. */}
      <Separator className="-mx-(--pane-padding) w-auto!" />

      <nav className={ROWS} aria-label="Blocks">
        {INVOICE_PARTS.map(({ id, label }) => {
          const isOn = invoice.parts[id]

          // The checkbox puts the block on the page or takes it off. The rest of
          // the row opens its page — only while it is on the page, since a
          // block that is not there has nothing to set. The button is stretched
          // over the whole row, padding and all, so the row is one target like
          // the format's; the checkbox sits above it to keep its own clicks.
          return (
            <Item key={id} size="sm" className={cn(ROW, 'relative', isOn && 'hover:bg-accent')}>
              <ItemMedia className="relative z-10">
                <Checkbox
                  checked={isOn}
                  onCheckedChange={(checked) => setPart(id, checked === true)}
                  aria-label={`Show ${label}`}
                />
              </ItemMedia>
              {isOn ? (
                <button
                  type="button"
                  className="flex min-w-0 flex-1 cursor-default items-center self-stretch text-left outline-none after:absolute after:inset-0 after:rounded-md focus-visible:after:outline-3 focus-visible:after:-outline-offset-1 focus-visible:after:outline-ring"

                  onClick={() => onNavigate(id)}
                >
                  <span className="flex-1 truncate">{label}</span>
                  <ChevronRight className="size-3.5 flex-none text-muted-foreground" aria-hidden="true" />
                </button>
              ) : (
                <span className="flex min-w-0 flex-1 items-center text-muted-foreground" aria-disabled="true">
                  <span className="flex-1 truncate">{label}</span>
                  <ChevronRight className="size-3.5 flex-none opacity-50" aria-hidden="true" />
                </span>
              )}
            </Item>
          )
        })}
      </nav>
    </div>
  )
}
