import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { DocumentPane } from '../DocumentPane'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../primitives/Field'
import { Input } from '../primitives/Input'
import { Textarea } from '../primitives/Textarea'
import type { InvoiceDocument, InvoiceItem, InvoiceSelection, InvoiceTextElementId } from '../../lib/invoice'
import {
  SELECTION_LABELS,
  inspectedSelection,
  isMultilineTextElement,
  isTextElement
} from '../../lib/invoice'

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
  // Prefixes the id each control is labelled by, unique to this inspector.
  const fieldId = useId()

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
    const controlId = `${fieldId}-${id}`

    return isMultilineTextElement(id) ? (
      <Textarea
        ref={ref}
        id={controlId}
        value={invoice[id]}
        onChange={(event) => setText(id, event.currentTarget.value)}
      />
    ) : (
      <Input
        ref={ref}
        id={controlId}
        value={invoice[id]}
        onChange={(event) => setText(id, event.currentTarget.value)}
      />
    )
  }

  // One text element's control under its name.
  const textField = (label: string, id: InvoiceTextElementId): ReactNode => (
    <Field>
      <FieldLabel htmlFor={`${fieldId}-${id}`}>{label}</FieldLabel>
      {textControl(id)}
    </Field>
  )

  const setItem = (id: string, field: keyof Omit<InvoiceItem, 'id'>, value: string | null) => {
    onChange({
      ...invoice,
      items: invoice.items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    })
  }

  // The document has more to it than fits one panel, so it gets a pane of
  // pages to move through instead of a single list of fields.
  if (inspected === 'document') return <DocumentPane invoice={invoice} onChange={onChange} />

  return (
    <div className="flex flex-col gap-3.5 p-4">
      <h2 className="text-sm font-semibold tracking-[0.02em]">{SELECTION_LABELS[inspected]}</h2>

      {inspected === 'header' && (
        <FieldGroup className="gap-3.5">
          <Group label={SELECTION_LABELS.logo}>
            <FieldDescription className="text-xs">No properties yet.</FieldDescription>
          </Group>

          {textField(SELECTION_LABELS.name, 'name')}

          {/* The two halves of what names this invoice, side by side. */}
          <div className="grid grid-cols-2 gap-2">
            {textField(SELECTION_LABELS.number, 'number')}
            {textField(SELECTION_LABELS.date, 'date')}
          </div>

          {textField(SELECTION_LABELS.headerText, 'headerText')}
        </FieldGroup>
      )}

      {isTextElement(inspected) && textField('Value', inspected)}

      {inspected === 'items' && (
        <FieldGroup className="gap-3.5">
          {invoice.items.map((item, index) => (
            <Group key={item.id} label={`Item ${index + 1}`}>
              <Input
                aria-label="Name"
                value={item.name}
                onChange={(event) => setItem(item.id, 'name', event.currentTarget.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel htmlFor={`${fieldId}-${item.id}-amount`}>Qty</FieldLabel>
                  <Input
                    id={`${fieldId}-${item.id}-amount`}
                    // A line left without an amount is a flat charge rather than
                    // a quantity of nothing, and an emptied field says so.
                    value={item.amount ?? ''}
                    onChange={(event) => {
                      const value = event.currentTarget.value
                      setItem(item.id, 'amount', value.trim() === '' ? null : value)
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${fieldId}-${item.id}-price`}>Price</FieldLabel>
                  <Input
                    id={`${fieldId}-${item.id}-price`}
                    value={item.price}
                    onChange={(event) => setItem(item.id, 'price', event.currentTarget.value)}
                  />
                </Field>
              </div>
            </Group>
          ))}
        </FieldGroup>
      )}
    </div>
  )
}

// A named block of controls. A fieldset rather than a label, because more than
// one control sits under the name — the labels inside it are the ones that
// belong to a field. It sits further from its neighbours than the controls
// inside it do from each other.
function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <FieldSet className="gap-2">
      <FieldLegend variant="label" className="mb-2">
        {label}
      </FieldLegend>
      {children}
    </FieldSet>
  )
}
