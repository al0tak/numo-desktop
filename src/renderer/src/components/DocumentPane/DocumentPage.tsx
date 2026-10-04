import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { PAGE_FORMATS } from '../../lib/invoice'
import { useDocumentPane } from './context'
import styles from './DocumentPane.module.css'

// The root: what there is to set about the document, one row per group, each
// row showing the group's current value so the root reads as a summary too.
export function DocumentPage() {
  const { invoice } = useDocumentPane()
  const formatLabel = invoice.format === 'custom' ? 'Custom' : PAGE_FORMATS[invoice.format].label

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Document</h2>
      <nav className={styles.links} aria-label="Document settings">
        <Link to="/format" className={styles.navigationRow}>
          <span>Format</span>
          <span className={styles.summary}>
            {formatLabel} · {invoice.width} × {invoice.height} mm
          </span>
          <ChevronRight className={styles.chevron} size={14} aria-hidden="true" />
        </Link>
      </nav>
    </div>
  )
}
