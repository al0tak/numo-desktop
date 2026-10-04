import type { ReactNode } from 'react'
import styles from './Field.module.css'

export type FieldProps = {
  label: string
  children: ReactNode
}

// One control under its name. A label, so the name is the control's — clicking
// it focuses the field, and a screen reader reads the two together.
export function Field({ label, children }: FieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  )
}
