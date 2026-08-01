import type { ComponentPropsWithRef } from 'react'
import styles from './Button.module.css'

export type ButtonProps = ComponentPropsWithRef<'button'>

// The base every other button builds on. It owns the element and the focus
// ring only — appearance and content belong to whatever composes it.
//
// A plain <button> gets keyboard walking, Enter/Space activation, disabled
// semantics and form participation from the platform.
export function Button({ className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={[styles.button, className].filter(Boolean).join(' ')} {...rest} />
}
