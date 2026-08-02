import type { ReactNode } from 'react'
import type { InvoiceDocument, InvoiceItem, InvoiceSelection, InvoiceTextElementId } from '../../lib/invoice'
import { EditableText } from '../EditableText'
import { InvoiceElement } from '../InvoiceElement'
import styles from './InvoiceView.module.css'

export type InvoiceViewProps = {
  invoice: InvoiceDocument
  selection: InvoiceSelection
  onSelect: (selection: InvoiceSelection) => void
  onChange: (invoice: InvoiceDocument) => void
}

// The invoice as it is printed, and as it is edited — every part of it is a
// hitbox the editor can select, and the text inside the selected one is typed
// into where it stands. What that selection then means is the sidebar's
// business; this component only reports it and draws the ring.
export function InvoiceView({ invoice, selection, onSelect, onChange }: InvoiceViewProps) {
  // Each text field's element id is its key on the document, so one helper
  // covers reading it, writing it back and wiring up its selection.
  const text = (id: InvoiceTextElementId, className?: string): ReactNode => (
    <InvoiceElement className={className} isSelected={selection === id} onSelect={() => onSelect(id)}>
      <EditableText
        value={invoice[id]}
        isEditable={selection === id}
        focusOnEdit
        onChange={(value) => onChange({ ...invoice, [id]: value })}
      />
    </InvoiceElement>
  )

  const setItem = (id: string, field: keyof Omit<InvoiceItem, 'id'>, value: string | null) => {
    onChange({
      ...invoice,
      items: invoice.items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    })
  }

  const areItemsEditable = selection === 'items'

  return (
    <div className={styles.invoice}>
      <header className={styles.head}>
        <InvoiceElement
          className={styles.logo}
          isSelected={selection === 'logo'}
          onSelect={() => onSelect('logo')}
        >
          {invoice.logo ? (
            <img className={styles.logoImage} src={invoice.logo} alt="" />
          ) : (
            <span className={styles.logoPlaceholder}>Logo</span>
          )}
        </InvoiceElement>
        <div className={styles.title}>
          {text('name', styles.name)}
          <div className={styles.meta}>
            <span className={styles.metaLabel}>No.</span>
            {text('number')}
            <span className={styles.metaLabel}>Date</span>
            {text('date')}
          </div>
        </div>
      </header>

      {text('header')}

      <div className={styles.parties}>
        <section className={styles.party}>
          <h2 className={styles.partyLabel}>From</h2>
          {text('issuer')}
        </section>
        <section className={styles.party}>
          <h2 className={styles.partyLabel}>Bill to</h2>
          {text('recipient')}
        </section>
      </div>

      <InvoiceElement isSelected={areItemsEditable} onSelect={() => onSelect('items')}>
        <table className={styles.items}>
          <thead>
            <tr>
              <th className={styles.itemName}>Item</th>
              <th className={styles.itemAmount}>Qty</th>
              <th className={styles.itemPrice}>Price</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className={styles.itemName}>
                  <EditableText
                    value={item.name}
                    isEditable={areItemsEditable}
                    onChange={(value) => setItem(item.id, 'name', value)}
                  />
                </td>
                <td className={styles.itemAmount}>
                  <EditableText
                    // A line with no amount reads as blank rather than as a
                    // quantity of nothing, and typing one in gives it one.
                    value={item.amount ?? ''}
                    isEditable={areItemsEditable}
                    onChange={(value) => setItem(item.id, 'amount', value.trim() === '' ? null : value)}
                  />
                </td>
                <td className={styles.itemPrice}>
                  <EditableText
                    value={item.price}
                    isEditable={areItemsEditable}
                    onChange={(value) => setItem(item.id, 'price', value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InvoiceElement>

      {text('underTableText')}
      {text('bottomText', styles.bottomText)}
      {text('footer', styles.footer)}
    </div>
  )
}
