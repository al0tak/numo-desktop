import type { ReactNode } from 'react'
import { cn } from 'cn'
import type { InvoiceDocument, InvoiceSelection, InvoiceTextElementId } from '../../lib/invoice'
import { inspectedSelection } from '../../lib/invoice'
import { InvoiceElement } from '../InvoiceElement'

// Sized in print units throughout — millimetres for the layout, points for the
// type — so the sheet stays the same figure on screen, on paper and in a PDF.
// The editor's zoom scales all of it together.

const PARTY_LABEL = 'text-[8pt] font-semibold tracking-[0.08em] text-[#8a8a8a] uppercase'

const HEADER_CELL = cn(PARTY_LABEL, 'border-b border-[#1a1a1a] pb-[2mm]')

const BODY_CELL = 'border-b border-[#e4e4e4] py-[2mm] align-top'

const NUMBER_CELL = 'pl-[6mm] text-right whitespace-nowrap'

// Values are stored with their newlines in them, so the page renders them. An
// emptied one would otherwise collapse to nothing, leaving no target to click.
const TEXT = 'min-h-[1em] whitespace-pre-wrap'

// Pinned to the foot of the sheet however much sits above it.
const FOOTER = 'mt-auto border-t border-[#e4e4e4] pt-[4mm] text-center text-[8pt] text-[#8a8a8a]'

export type InvoiceViewProps = {
  invoice: InvoiceDocument
  selection: InvoiceSelection
  onSelect: (selection: InvoiceSelection) => void
}

// The invoice as it is printed. Every part of it is a hitbox the editor can
// select — that is all this component does with a pointer. The values it draws
// are typed into the sidebar, which is the one place editing happens.
export function InvoiceView({ invoice, selection, onSelect }: InvoiceViewProps) {
  // What is drawn as picked, which for a part of a group is the whole group.
  const inspected = inspectedSelection(selection)

  // Each text field's element id is its key on the document, so one helper
  // covers drawing it and wiring up its selection.
  const text = (id: InvoiceTextElementId, className?: string): ReactNode => (
    <InvoiceElement
      className={cn(TEXT, className)}
      isSelected={selection === id}
      // An element that answers with something other than itself is inside a
      // group, and the group is what carries the ring.
      isPart={inspectedSelection(id) !== id}
      onSelect={() => onSelect(id)}
    >
      {invoice[id]}
    </InvoiceElement>
  )

  return (
    <div className="flex h-full flex-col gap-[8mm] p-[16mm] text-[10pt] leading-normal text-[#1a1a1a]">
      {/* Logo, title, number, date and the text under them are one block on the
          page and one selection: a click anywhere in here inspects the header,
          and the part it landed on is the part the sidebar leads with. */}
      <InvoiceElement
        className="flex flex-col gap-[8mm]"
        isSelected={inspected === 'header'}
        onSelect={() => onSelect('header')}
      >
        <div className="flex items-start justify-between gap-[8mm]">
          <InvoiceElement
            className="flex-none"
            isSelected={selection === 'logo'}
            isPart
            onSelect={() => onSelect('logo')}
          >
            {invoice.logo ? (
              <img className="block max-h-[20mm] max-w-[40mm]" src={invoice.logo} alt="" />
            ) : (
              <span className="grid h-[16mm] w-[30mm] place-items-center rounded-[1mm] border border-dashed border-[#c4c4c4] text-[8pt] text-[#9a9a9a]">
                Logo
              </span>
            )}
          </InvoiceElement>
          <div className="flex flex-col items-end gap-[2mm] text-right">
            {text('name', 'text-[20pt] font-semibold tracking-[0.02em] uppercase')}
            <div className="grid grid-cols-[auto_auto] items-baseline gap-x-[3mm]">
              <span className="text-[#8a8a8a]">No.</span>
              {text('number')}
              <span className="text-[#8a8a8a]">Date</span>
              {text('date')}
            </div>
          </div>
        </div>

        {text('headerText')}
      </InvoiceElement>

      <div className="grid grid-cols-2 gap-[8mm]">
        <section className="flex flex-col gap-[1mm]">
          <h2 className={PARTY_LABEL}>From</h2>
          {text('issuer')}
        </section>
        <section className="flex flex-col gap-[1mm]">
          <h2 className={PARTY_LABEL}>Bill to</h2>
          {text('recipient')}
        </section>
      </div>

      <InvoiceElement isSelected={selection === 'items'} onSelect={() => onSelect('items')}>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={cn(HEADER_CELL, 'w-full text-left')}>Item</th>
              <th className={cn(HEADER_CELL, NUMBER_CELL)}>Qty</th>
              <th className={cn(HEADER_CELL, NUMBER_CELL)}>Price</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className={cn(BODY_CELL, 'w-full text-left')}>{item.name}</td>
                {/* A line with no amount stays blank rather than reading as a
                    quantity of nothing. */}
                <td className={cn(BODY_CELL, NUMBER_CELL)}>{item.amount}</td>
                <td className={cn(BODY_CELL, NUMBER_CELL)}>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InvoiceElement>

      {text('underTableText')}
      {text('bottomText', 'mt-[4mm]')}
      {text('footer', FOOTER)}
    </div>
  )
}
