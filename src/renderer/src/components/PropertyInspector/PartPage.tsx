import { HeaderFields, ItemsFields, TextElementField } from '../InvoiceFields'
import { INVOICE_PARTS } from '../../lib/invoice'
import type { InvoicePartId } from '../../lib/invoice'
import { BackButton } from './BackButton'
import type { InspectorPageProps } from './PropertyInspector'
import { HEADING, PAGE } from './styles'

export type PartPageProps = InspectorPageProps & {
  part: InvoicePartId
}

// The settings of one block of the page: the fields for everything in it. It is
// where a click on the page lands as well as where the document's list leads.
export function PartPage({ part, invoice, onChange, onNavigate }: PartPageProps) {
  const { label } = INVOICE_PARTS.find(({ id }) => id === part)!
  const fields = { invoice, onChange }

  return (
    <div className={PAGE}>
      <BackButton onClick={() => onNavigate('root')} />
      <h2 className={HEADING}>{label}</h2>

      {part === 'header' && <HeaderFields {...fields} />}
      {part === 'parties' && (
        <>
          <TextElementField {...fields} id="issuer" />
          <TextElementField {...fields} id="recipient" />
        </>
      )}
      {part === 'items' && <ItemsFields {...fields} />}
      {part === 'notes' && (
        <>
          <TextElementField {...fields} id="underTableText" />
          <TextElementField {...fields} id="bottomText" />
        </>
      )}
      {part === 'footer' && <TextElementField {...fields} id="footer" label="Text" />}
    </div>
  )
}
