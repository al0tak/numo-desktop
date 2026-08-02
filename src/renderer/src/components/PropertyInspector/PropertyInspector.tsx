import type { InvoiceDocument, InvoiceSelection, PageFormat } from '../../lib/invoice'
import { PAGE_FORMATS, SELECTION_LABELS } from '../../lib/invoice'
import styles from './PropertyInspector.module.css'

export type PropertyInspectorProps = {
  invoice: InvoiceDocument
  selection: InvoiceSelection
  onChange: (invoice: InvoiceDocument) => void
}

// The sidebar's contents: the properties of whatever is selected on the page,
// falling back to the document's own when nothing is.
//
// Only the document has any properties yet. The elements each get their heading
// so it is clear what is being edited, and their fields — colour, font, variant
// — land underneath it as they are modelled.
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

  return (
    <div className={styles.inspector}>
      <h2 className={styles.heading}>{SELECTION_LABELS[selection]}</h2>

      {selection === 'document' ? (
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
      ) : (
        <p className={styles.empty}>No properties yet.</p>
      )}
    </div>
  )
}
