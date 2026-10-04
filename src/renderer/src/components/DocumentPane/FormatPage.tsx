import { Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { Field } from '../Field'
import { Input } from '../Input'
import { Select } from '../Select'
import { PAGE_FORMATS } from '../../lib/invoice'
import type { PageFormat } from '../../lib/invoice'
import { useDocumentPane } from './context'
import styles from './DocumentPane.module.css'

export function FormatPage() {
  const { invoice, onChange } = useDocumentPane()

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
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        <ChevronLeft size={14} aria-hidden="true" />
        Document
      </Link>
      <h2 className={styles.heading}>Format</h2>

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
  )
}
