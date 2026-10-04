import { INVOICE_PARTS, PAGE_FORMATS } from './invoice'
import type { InvoiceDocument, InvoiceItem } from './invoice'

// The .numo file: plain JSON, the document wrapped in a small header.
//
// `format` tells our files apart from any other JSON a user might point the
// app at. `version` is bumped whenever the document's shape changes, and
// parseDocumentFile is where an older version would be migrated forward.
//
// Images are embedded as data URLs (the logo today), so a file is the whole
// document and never depends on anything beside it.
const FORMAT = 'numo-invoice'
// 2: `parts`, which blocks are on the page.
const VERSION = 2

type DocumentFile = {
  format: typeof FORMAT
  version: typeof VERSION
  document: InvoiceDocument
}

export function serializeDocument(document: InvoiceDocument): string {
  const file: DocumentFile = { format: FORMAT, version: VERSION, document }
  return JSON.stringify(file, null, 2) + '\n'
}

// Reads a file back into a document, or throws with a message fit to show the
// user. A file is checked field by field rather than trusted, since anything
// can end up in a file with the right extension.
export function parseDocumentFile(contents: string): InvoiceDocument {
  let file: unknown
  try {
    file = JSON.parse(contents)
  } catch {
    throw new Error('The file is not a Numo invoice — it could not be read as JSON.')
  }

  if (!isRecord(file) || file.format !== FORMAT) {
    throw new Error('The file is not a Numo invoice.')
  }
  if (typeof file.version !== 'number' || file.version > VERSION) {
    throw new Error('The file was saved by a newer version of Numo. Update the app to open it.')
  }
  const document = migrate(file.version, file.document)
  if (!isInvoiceDocument(document)) {
    throw new Error('The file is damaged — the invoice inside it is incomplete.')
  }

  return document
}

// Brings a document saved by an older version up to the current shape, one
// version at a time.
function migrate(version: number, document: unknown): unknown {
  if (!isRecord(document)) return document

  // Version 1 had no way to take a block off the page, so all of them are on.
  if (version < 2) {
    document = { ...document, parts: Object.fromEntries(INVOICE_PARTS.map(({ id }) => [id, true])) }
  }

  return document
}

const STRING_FIELDS = [
  'name',
  'headerText',
  'number',
  'date',
  'issuer',
  'recipient',
  'underTableText',
  'bottomText',
  'footer'
] as const

function isInvoiceDocument(value: unknown): value is InvoiceDocument {
  if (!isRecord(value)) return false

  return (
    (value.format === 'custom' || Object.hasOwn(PAGE_FORMATS, value.format as string)) &&
    typeof value.width === 'number' &&
    typeof value.height === 'number' &&
    (value.logo === null || typeof value.logo === 'string') &&
    STRING_FIELDS.every((field) => typeof value[field] === 'string') &&
    Array.isArray(value.items) &&
    value.items.every(isInvoiceItem) &&
    isRecord(value.parts) &&
    INVOICE_PARTS.every(({ id }) => typeof (value.parts as Record<string, unknown>)[id] === 'boolean')
  )
}

function isInvoiceItem(value: unknown): value is InvoiceItem {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (value.amount === null || typeof value.amount === 'string') &&
    typeof value.price === 'string'
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
