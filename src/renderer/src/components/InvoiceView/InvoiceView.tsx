import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'
import type { InvoiceDocument, InvoiceSelection, InvoiceTextElementId } from '../../lib/invoice'
import { inspectedSelection } from '../../lib/invoice'
import { InvoiceElement } from '../InvoiceElement'
import styles from './InvoiceView.module.css'

export type InvoiceViewProps = {
  invoice: InvoiceDocument
  selection: InvoiceSelection
  onSelect: (selection: InvoiceSelection) => void
}

// The invoice as it is printed. Every part of it is a hitbox the editor can
// select — that is all this component does with a pointer. The values it draws
// are typed into the sidebar, which is the one place editing happens.
export function InvoiceView({ invoice, selection, onSelect }: InvoiceViewProps) {
  // What is drawn as picked, which for a part of a group is the whole group.
  const inspected = inspectedSelection(selection)

  // Each text field's element id is its key on the document, so one helper
  // covers drawing it and wiring up its selection.
  const text = (id: InvoiceTextElementId, className?: string): ReactNode => (
    <InvoiceElement
      className={cx(styles.text, className)}
      isSelected={selection === id}
      // An element that answers with something other than itself is inside a
      // group, and the group is what carries the ring.
      isPart={inspectedSelection(id) !== id}
      onSelect={() => onSelect(id)}
    >
      {invoice[id]}
    </InvoiceElement>
  )

  return (
    <div className={styles.invoice}>
      {/* Logo, title, number, date and the text under them are one block on the
          page and one selection: a click anywhere in here inspects the header,
          and the part it landed on is the part the sidebar leads with. */}
      <InvoiceElement
        className={styles.header}
        isSelected={inspected === 'header'}
        onSelect={() => onSelect('header')}
      >
        <div className={styles.head}>
          <InvoiceElement
            className={styles.logo}
            isSelected={selection === 'logo'}
            isPart
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
        </div>

        {text('headerText')}
      </InvoiceElement>

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

      <InvoiceElement isSelected={selection === 'items'} onSelect={() => onSelect('items')}>
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
                <td className={styles.itemName}>{item.name}</td>
                {/* A line with no amount stays blank rather than reading as a
                    quantity of nothing. */}
                <td className={styles.itemAmount}>{item.amount}</td>
                <td className={styles.itemPrice}>{item.price}</td>
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
