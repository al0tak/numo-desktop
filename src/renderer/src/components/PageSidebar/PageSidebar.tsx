import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../lib/cx'
import styles from './PageSidebar.module.css'

export type PageSidebarProps = ComponentPropsWithRef<'aside'>

// A page's left panel. It runs the full height of the window rather than
// starting below the title bar, so the traffic lights sit over its top-left
// corner — see .app in index.css for the padding that keeps room for them.
export function PageSidebar({ className, ...rest }: PageSidebarProps) {
  return <aside className={cx(styles.pageSidebar, className)} {...rest} />
}
