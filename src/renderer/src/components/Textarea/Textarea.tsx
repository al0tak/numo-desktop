import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../lib/cx'
import styles from './Textarea.module.css'

export type TextareaProps = ComponentPropsWithRef<'textarea'>

// A multi-line text field, wearing the same box as Input.
//
// No rows: the field sizes itself to what is in it (`field-sizing: content`),
// between a floor and a ceiling set in the stylesheet, so a one-line value is
// not a four-line box and a long one does not have to be scrolled blind.
export function Textarea({ className, ...rest }: TextareaProps) {
  return <textarea className={cx(styles.textarea, className)} {...rest} />
}
