import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Input } from '../Input'
import { Select } from '../Select'
import { Textarea } from '../Textarea'
import type {
  InvoiceDocument,
  InvoiceItem,
  InvoiceSelection,
  InvoiceTextElementId,
  PageFormat
} from '../../lib/invoice'
import {
  PAGE_FORMATS,
  SELECTION_LABELS,
  inspectedSelection,
  isMultilineTextElement,
  isTextElement
} from '../../lib/invoice'
import styles from './PropertyInspector.module.css'

export type PropertyInspectorProps = {
  invoice: InvoiceDocument
  selection: InvoiceSelection
  onChange: (invoice: InvoiceDocument) => void
}

// The sidebar's contents: everything there is to edit about whatever is
// selected on the page, falling back to the document itself when nothing is.
// What is selected is a block where the page has one — the header is inspected
// whole, its logo, title, number, date and text under a single heading.
//
// The page is only ever read from — an element's own text is typed in here,
// which is why the value comes first. What follows it is where colour, font and
// the rest land as they are modelled.
export function PropertyInspector({ invoice, selection, onChange }: PropertyInspectorProps) {
  const inspected = inspectedSelection(selection)

  // The page and the sidebar are two views of one thing, so a click on the page
  // finishes here: the field for whatever was clicked takes the cursor, and the
  // click and the typing that follows it are a single move. Only a change of
  // selection moves the cursor — typing re-renders the field without pulling
  // focus back to it.
  const selectedField = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    selectedField.current?.focus()
  }, [selection])

  // Passed to the control that edits the selected element, and to no other, so
  // the ref holds whichever one that is.
  const holdSelectedField = (field: HTMLInputElement | HTMLTextAreaElement | null) => {
    selectedField.current = field
  }

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

  // The control that edits one text element. Which of the two it is comes from
  // the element: only a value that is a block of lines is worth a field that
  // grows into one.
  const textControl = (id: InvoiceTextElementId): ReactNode => {
    // The ref goes to the selected element's control and to no other, so a
    // click on the page can hand it the cursor.
    const ref = selection === id ? holdSelectedField : undefined

    return isMultilineTextElement(id) ? (
      <Textarea ref={ref} value={invoice[id]} onChange={(event) => setText(id, event.currentTarget.value)} />
    ) : (
      <Input ref={ref} value={invoice[id]} onChange={(event) => setText(id, event.currentTarget.value)} />
    )
  }

  const setItem = (id: string, field: keyof Omit<InvoiceItem, 'id'>, value: string | null) => {
    onChange({
      ...invoice,
      items: invoice.items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    })
  }

  return (
    <div className={styles.inspector}>
      <h2 className={styles.heading}>{SELECTION_LABELS[inspected]}</h2>

      {inspected === 'document' && (
        <div className={styles.fields}>
          <Field label="Format">
            <Select
              value={invoice.format}
              onChange={(event) => setFormat(event.currentTarget.value as PageFormat)}
            >
              {Object.entries(PAGE_FORMATS).map(([format, { label }]) => (
                <option key={format} value={format}>
                  {label}
                </option>
              ))}
              <option value="custom">Custom</option>
            </Select>
          </Field>

          {/* The two sides of one size, side by side. */}
          <div className={styles.row}>
            <Field label="Width">
              <Input
                type="number"
                min={1}
                value={invoice.width}
                onChange={(event) => setSize('width', event.currentTarget.valueAsNumber)}
              />
            </Field>

            <Field label="Height">
              <Input
                type="number"
                min={1}
                value={invoice.height}
                onChange={(event) => setSize('height', event.currentTarget.valueAsNumber)}
              />
            </Field>
          </div>
        </div>
      )}

      {inspected === 'header' && (
        <div className={styles.fields}>
          <Group label={SELECTION_LABELS.logo}>
            <p className={styles.empty}>No properties yet.</p>
          </Group>

          <Field label={SELECTION_LABELS.name}>{textControl('name')}</Field>

          {/* The two halves of what names this invoice, side by side. */}
          <div className={styles.row}>
            <Field label={SELECTION_LABELS.number}>{textControl('number')}</Field>
            <Field label={SELECTION_LABELS.date}>{textControl('date')}</Field>
          </div>

          <Field label={SELECTION_LABELS.headerText}>{textControl('headerText')}</Field>
        </div>
      )}

      {isTextElement(inspected) && <Field label="Value">{textControl(inspected)}</Field>}

      {inspected === 'items' && (
        <div className={styles.fields}>
          {invoice.items.map((item, index) => (
            <Group key={item.id} label={`Item ${index + 1}`}>
              <Input
                value={item.name}
                onChange={(event) => setItem(item.id, 'name', event.currentTarget.value)}
              />
              <div className={styles.row}>
                <Field label="Qty">
                  <Input
                    // A line left without an amount is a flat charge rather than
                    // a quantity of nothing, and an emptied field says so.
                    value={item.amount ?? ''}
                    onChange={(event) => {
                      const value = event.currentTarget.value
                      setItem(item.id, 'amount', value.trim() === '' ? null : value)
                    }}
                  />
                </Field>
                <Field label="Price">
                  <Input
                    value={item.price}
                    onChange={(event) => setItem(item.id, 'price', event.currentTarget.value)}
                  />
                </Field>
              </div>
            </Group>
          ))}
        </div>
      )}
    </div>
  )
}

// One control under its name. A label, so the name is the control's — clicking
// it focuses the field, and a screen reader reads the two together.
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  )
}

// A named block of controls. A div rather than a label, because more than one
// control sits under the name — the labels inside it are the ones that belong
// to a field.
function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.group}>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  )
}
