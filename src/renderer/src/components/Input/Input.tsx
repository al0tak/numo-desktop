import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../lib/cx'
import styles from './Input.module.css'

export type InputProps = ComponentPropsWithRef<'input'>

// A single-line text field. The element is a plain <input>, so typing,
// selection, undo, autofill and every input type the platform knows come with
// it — this only dresses the box it draws.
export function Input({ className, type = 'text', ...rest }: InputProps) {
  return <input type={type} className={cx(styles.input, className)} {...rest} />
}
