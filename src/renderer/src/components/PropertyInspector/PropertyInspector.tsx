import type { ReactNode } from 'react'
import type {
  InvoiceDocument,
  InvoiceItem,
  InvoiceSelection,
  InvoiceTextElementId,
  PageFormat
} from '../../lib/invoice'
import { PAGE_FORMATS, SELECTION_LABELS, isMultilineTextElement, isTextElement } from '../../lib/invoice'
import styles from './PropertyInspector.module.css'

export type PropertyInspectorProps = {
  invoice: InvoiceDocument
  selection: InvoiceSelection
  onChange: (invoice: InvoiceDocument) => void
}

// The sidebar's contents: everything there is to edit about whatever is
// selected on the page, falling back to the document itself when nothing is.
//
// The page is only ever read from — an element's own text is typed in here,
// which is why the value comes first. What follows it is where colour, font and
// the rest land as they are modelled.
export function PropertyInspector({ invoice, selection, onChange }: PropertyInspectorProps) {
  const setFormat = (format: PageFormat) => {
    // Custom is not a size, it is the mark left when one is typed in by hand, so
    // choosing it keeps the page exactly as it is.
    if (format === 'custom') {
      onChange({ ...invoice, format })
      return
    }

    onChange({ ...invoice, format, ...PAGE_FORMATS[format] })
  }

  const setSize = (side: 'width' | 'height', value: number) => {
    // An emptied or half-typed field reads as NaN, which would leave the page
    // with no size at all. The field keeps what the user typed either way; the
    // document only follows once it is a number again.
    if (Number.isNaN(value)) return

    onChange({ ...invoice, format: 'custom', [side]: value })
  }

  const setText = (id: InvoiceTextElementId, value: string) => {
    onChange({ ...invoice, [id]: value })
  }

  const setItem = (id: string, field: keyof Omit<InvoiceItem, 'id'>, value: string | null) => {
    onChange({
      ...invoice,
      items: invoice.items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    })
  }

  return (
    <div className={styles.inspector}>
      <h2 className={styles.heading}>{SELECTION_LABELS[selection]}</h2>

      {selection === 'document' && (
        <div className={styles.fields}>
          <label className={styles.field}>
            <span className={styles.label}>Format</span>
            <select
              className={styles.control}
              value={invoice.format}
              onChange={(event) => setFormat(event.currentTarget.value as PageFormat)}
            >
              {Object.entries(PAGE_FORMATS).map(([format, { label }]) => (
                <option key={format} value={format}>
                  {label}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Width</span>
            <input
              className={styles.control}
              type="number"
              min={1}
              value={invoice.width}
              onChange={(event) => setSize('width', event.currentTarget.valueAsNumber)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Height</span>
            <input
              className={styles.control}
              type="number"
              min={1}
              value={invoice.height}
              onChange={(event) => setSize('height', event.currentTarget.valueAsNumber)}
            />
          </label>
        </div>
      )}

      {isTextElement(selection) && (
        <label className={styles.section}>
          <span className={styles.label}>Value</span>
          {isMultilineTextElement(selection) ? (
            <textarea
              className={styles.control}
              rows={4}
              value={invoice[selection]}
              onChange={(event) => setText(selection, event.currentTarget.value)}
            />
          ) : (
            <input
              className={styles.control}
              type="text"
              value={invoice[selection]}
              onChange={(event) => setText(selection, event.currentTarget.value)}
            />
          )}
        </label>
      )}

      {selection === 'items' && (
        <div className={styles.fields}>
          {invoice.items.map((item, index) => (
            <Section key={item.id} label={`Item ${index + 1}`}>
              <input
                className={styles.control}
                type="text"
                value={item.name}
                onChange={(event) => setItem(item.id, 'name', event.currentTarget.value)}
              />
              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>Qty</span>
                  <input
                    className={styles.control}
                    type="text"
                    // A line left without an amount is a flat charge rather than
                    // a quantity of nothing, and an emptied field says so.
                    value={item.amount ?? ''}
                    onChange={(event) => {
                      const value = event.currentTarget.value
                      setItem(item.id, 'amount', value.trim() === '' ? null : value)
                    }}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Price</span>
                  <input
                    className={styles.control}
                    type="text"
                    value={item.price}
                    onChange={(event) => setItem(item.id, 'price', event.currentTarget.value)}
                  />
                </label>
              </div>
            </Section>
          ))}
        </div>
      )}

      {selection === 'logo' && <p className={styles.empty}>No properties yet.</p>}
    </div>
  )
}

// A labelled block of controls. A div rather than a label, because more than
// one control sits under the name — the labels inside it are the ones that
// belong to a field.
function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.section}>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  )
}
