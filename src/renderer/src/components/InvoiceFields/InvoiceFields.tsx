import { useId } from 'react'
import type { ReactNode } from 'react'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '../primitives/Field'
import { Input } from '../primitives/Input'
import { Textarea } from '../primitives/Textarea'
import { SELECTION_LABELS, isMultilineTextElement } from '../../lib/invoice'
import type { InvoiceDocument, InvoiceItem, InvoiceTextElementId } from '../../lib/invoice'

// The controls that edit the invoice's elements, shared by everywhere the
// sidebar shows them: the inspector for whatever is clicked on the page, and
// the document pane's page for each block.
//
// Every control carries its element's id as data-element, so whoever shows them
// can hand the cursor to the one for what was clicked without threading a ref
// through.

export type InvoiceFieldsProps = {
  invoice: InvoiceDocument
  onChange: (invoice: InvoiceDocument) => void
}

export type TextElementFieldProps = InvoiceFieldsProps & {
  id: InvoiceTextElementId
  // The element's own name when left out.
  label?: string
}

// One text element's control under its name. Which control it is comes from
// the element: only a value that is a block of lines is worth a field that
// grows into one.
export function TextElementField({
  invoice,
  onChange,
  id,
  label = SELECTION_LABELS[id]
}: TextElementFieldProps) {
  const controlId = useId()
  const control = {
    id: controlId,
    'data-element': id,
    value: invoice[id],
    onChange: (event: { currentTarget: { value: string } }) =>
      onChange({ ...invoice, [id]: event.currentTarget.value })
  }

  return (
    <Field>
      <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
      {isMultilineTextElement(id) ? <Textarea {...control} /> : <Input {...control} />}
    </Field>
  )
}

// The header block whole: its logo, title, number, date and text.
export function HeaderFields({ invoice, onChange }: InvoiceFieldsProps) {
  return (
    <FieldGroup className="gap-3.5">
      <Group label={SELECTION_LABELS.logo}>
        <FieldDescription className="text-xs">No properties yet.</FieldDescription>
      </Group>

      <TextElementField invoice={invoice} onChange={onChange} id="name" />

      {/* The two halves of what names this invoice, side by side. */}
      <div className="grid grid-cols-2 gap-2">
        <TextElementField invoice={invoice} onChange={onChange} id="number" />
        <TextElementField invoice={invoice} onChange={onChange} id="date" />
      </div>

      <TextElementField invoice={invoice} onChange={onChange} id="headerText" />
    </FieldGroup>
  )
}

// The table's lines, one group of controls each.
export function ItemsFields({ invoice, onChange }: InvoiceFieldsProps) {
  const fieldId = useId()

  const setItem = (id: string, field: keyof Omit<InvoiceItem, 'id'>, value: string | null) => {
    onChange({
      ...invoice,
      items: invoice.items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    })
  }

  return (
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
