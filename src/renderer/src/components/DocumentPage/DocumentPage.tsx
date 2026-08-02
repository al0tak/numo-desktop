import type { ComponentPropsWithRef } from 'react'
import { cx } from '../../lib/cx'
import styles from './DocumentPage.module.css'

export type DocumentPageProps = ComponentPropsWithRef<'div'> & {
  // Millimetres, the units the sheet is printed in. CSS millimetres are a fixed
  // ratio to pixels (96dpi), so an A4 lays out as 794 x 1123 CSS px while
  // staying the same figure a print stylesheet or the PDF export would state.
  width: number
  height: number
}

// One sheet of the invoice, sized in real print units.
//
// It carries no notion of where it sits or how far it is zoomed: it is laid out
// on EditorView's plane like any other block, so several of these can sit side
// by side later without either component learning about the other.
export function DocumentPage({ className, width, height, style, ...rest }: DocumentPageProps) {
  return (
    <div
      className={cx(styles.documentPage, className)}
      style={{ width: `${width}mm`, height: `${height}mm`, ...style }}
      {...rest}
    />
  )
}
