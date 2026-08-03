// The shape of an invoice, and the elements of it the editor can select.
//
// Every field is a plain string for now. Styling and per-field variants are not
// modelled yet: when they arrive a field like `header` grows from a string into
// an object with a `value` alongside whatever describes how it is drawn, and
// only this file and the two components that read it have to follow.
//
// Nothing here is persisted — a document lives in the editor's state for the
// lifetime of the window and is gone when it closes.

export type InvoiceItem = {
  id: string
  name: string
  // Null for a line that is not counted, a flat charge: `price` is then the
  // price of the line itself rather than the price of one unit.
  amount: string | null
  price: string
}

// Page sizes in millimetres, the units the page is laid out and printed in.
export const PAGE_FORMATS = {
  a4: { label: 'A4', width: 210, height: 297 },
  letter: { label: 'Letter', width: 216, height: 279 }
} as const

// `custom` is what a page becomes once its size is typed in by hand — it names
// the absence of a preset, so it has no entry in PAGE_FORMATS.
export type PageFormat = keyof typeof PAGE_FORMATS | 'custom'

export type InvoiceDocument = {
  format: PageFormat
  width: number
  height: number
  // What the document calls itself — invoice, factura, bill. Not a file name.
  name: string
  logo: string | null
  header: string
  number: string
  date: string
  // The two parties, in the terms an invoice states them: the issuer raises it,
  // the recipient owes it.
  issuer: string
  recipient: string
  items: InvoiceItem[]
  underTableText: string
  bottomText: string
  footer: string
}

// The fields that are a single run of text on the page. Their ids are their
// keys in InvoiceDocument, so selecting one is enough to read and write it.
export type InvoiceTextElementId =
  'name' | 'header' | 'number' | 'date' | 'issuer' | 'recipient' | 'underTableText' | 'bottomText' | 'footer'

const TEXT_ELEMENT_IDS: InvoiceTextElementId[] = [
  'name',
  'header',
  'number',
  'date',
  'issuer',
  'recipient',
  'underTableText',
  'bottomText',
  'footer'
]

// The ones whose value is a block of lines rather than one — an address, a
// note. Only they are worth a multi-line control in the sidebar.
const MULTILINE_TEXT_ELEMENT_IDS: InvoiceTextElementId[] = [
  'header',
  'issuer',
  'recipient',
  'underTableText',
  'bottomText',
  'footer'
]

export type InvoiceElementId = InvoiceTextElementId | 'logo' | 'items'

// What the sidebar is inspecting. With no element selected it falls back to the
// document itself, which is where the editor starts.
export type InvoiceSelection = 'document' | InvoiceElementId

export const SELECTION_LABELS: Record<InvoiceSelection, string> = {
  document: 'Document',
  name: 'Document name',
  logo: 'Logo',
  header: 'Header',
  number: 'Invoice number',
  date: 'Invoice date',
  issuer: 'Issuer',
  recipient: 'Recipient',
  items: 'Items',
  underTableText: 'Under-table text',
  bottomText: 'Bottom text',
  footer: 'Footer'
}

export function isTextElement(selection: InvoiceSelection): selection is InvoiceTextElementId {
  return TEXT_ELEMENT_IDS.includes(selection as InvoiceTextElementId)
}

export function isMultilineTextElement(id: InvoiceTextElementId): boolean {
  return MULTILINE_TEXT_ELEMENT_IDS.includes(id)
}

// A document to develop against until there is a real one to open. Every value
// names the slot it sits in rather than pretending to be an invoice, so nothing
// on the page reads as a decision that has been made about wording or format.
export function createMockInvoiceDocument(): InvoiceDocument {
  return {
    format: 'a4',
    width: PAGE_FORMATS.a4.width,
    height: PAGE_FORMATS.a4.height,
    name: 'Invoice',
    logo: null,
    header: 'Company name\nCompany street 1\nCompany city',
    number: 'Invoice number',
    date: 'Invoice date',
    issuer: 'Company name\nCompany tax number',
    recipient: 'Client name\nClient street 1\nClient city',
    items: [
      { id: crypto.randomUUID(), name: 'Item one', amount: '1', price: '100.00' },
      { id: crypto.randomUUID(), name: 'Item two', amount: '2', price: '200.00' },
      // No amount: a flat charge, the case the table has to hold.
      { id: crypto.randomUUID(), name: 'Item three', amount: null, price: '300.00' }
    ],
    underTableText: 'Under-table text',
    bottomText: 'Bottom text',
    footer: 'Footer'
  }
}
