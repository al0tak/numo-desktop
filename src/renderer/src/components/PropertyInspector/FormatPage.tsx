import { useId } from 'react'
import { Field, FieldLabel } from '../primitives/Field'
import { Input } from '../primitives/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../primitives/Select'
import { PAGE_FORMATS } from '../../lib/invoice'
import type { PageFormat } from '../../lib/invoice'
import type { InspectorPageProps } from './PropertyInspector'
import { BackButton } from './BackButton'
import { HEADING, PAGE } from './styles'

export function FormatPage({ invoice, onChange, onNavigate }: InspectorPageProps) {
  const fieldId = useId()

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
    <div className={PAGE}>
      <BackButton onClick={() => onNavigate('root')} />
      <h2 className={HEADING}>Format</h2>

      <Field>
        <FieldLabel htmlFor={`${fieldId}-format`}>Format</FieldLabel>
        <Select value={invoice.format} onValueChange={(format) => setFormat(format as PageFormat)}>
          <SelectTrigger id={`${fieldId}-format`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PAGE_FORMATS).map(([format, { label }]) => (
              <SelectItem key={format} value={format}>
                {label}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {/* The two sides of one size, side by side. */}
      <div className="grid grid-cols-2 gap-2">
        <Field>
          <FieldLabel htmlFor={`${fieldId}-width`}>Width</FieldLabel>
          <Input
            id={`${fieldId}-width`}
            type="number"
            min={1}
            value={invoice.width}
            onChange={(event) => setSize('width', event.currentTarget.valueAsNumber)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${fieldId}-height`}>Height</FieldLabel>
          <Input
            id={`${fieldId}-height`}
            type="number"
            min={1}
            value={invoice.height}
            onChange={(event) => setSize('height', event.currentTarget.valueAsNumber)}
          />
        </Field>
      </div>
    </div>
  )
}
