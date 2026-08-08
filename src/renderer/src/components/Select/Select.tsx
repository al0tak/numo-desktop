import { ChevronDown } from 'lucide-react'
import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../lib/cx'
import styles from './Select.module.css'

export type SelectProps = ComponentPropsWithRef<'select'>

// A dropdown wearing the same box as Input.
//
// Still a native <select>: the OS draws the menu, and keyboard walking,
// type-ahead and form participation come with it. Only the closed box is ours,
// and dropping its appearance takes the platform's arrow with it — hence the
// chevron beside it, which is decoration and stays out of the pointer's way.
export function Select({ className, ...rest }: SelectProps) {
  return (
    <span className={cx(styles.wrapper, className)}>
      <select className={styles.select} {...rest} />
      <ChevronDown className={styles.chevron} size={14} aria-hidden />
    </span>
  )
}
