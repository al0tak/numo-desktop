import type { ComponentPropsWithRef } from 'react'
import { cn } from 'cn'

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
      className={cn('bg-white shadow-[0_1px_3px_rgb(0_0_0/0.08)]', className)}
      style={{ width: `${width}mm`, height: `${height}mm`, ...style }}
      {...rest}
    />
  )
}
