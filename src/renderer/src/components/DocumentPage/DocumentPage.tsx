import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../lib/cx'
import styles from './DocumentPage.module.css'

export type DocumentPageProps = ComponentPropsWithRef<'div'>

// One sheet of the invoice — an A4 page, sized in real print units.
//
// It carries no notion of where it sits or how far it is zoomed: it is laid out
// on EditorView's plane like any other block, so several of these can sit side
// by side later without either component learning about the other.
export function DocumentPage({ className, ...rest }: DocumentPageProps) {
  return <div className={cx(styles.documentPage, className)} {...rest} />
}
