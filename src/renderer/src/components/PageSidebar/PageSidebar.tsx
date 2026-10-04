import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../lib/cx'
import styles from './PageSidebar.module.css'

export type PageSidebarProps = ComponentPropsWithRef<'aside'>

// A page's left panel. It runs the full height of whatever row it is placed in
// and touches the window on its left and bottom edges.
export function PageSidebar({ className, ...rest }: PageSidebarProps) {
  return <aside className={cx(styles.pageSidebar, className)} {...rest} />
}
