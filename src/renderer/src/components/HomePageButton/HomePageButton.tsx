import type { ReactNode } from 'react'
import { Button, type ButtonProps } from '../Button'
import styles from './HomePageButton.module.css'

export type HomePageButtonProps = ButtonProps & {
  /** Rendered above the label and hidden from assistive tech. */
  icon?: ReactNode
}

// The large tinted action on the home screen: icon stacked over its label.
export function HomePageButton({ icon, children, className, ...rest }: HomePageButtonProps) {
  return (
    <Button className={[styles.homePageButton, className].filter(Boolean).join(' ')} {...rest}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Button>
  )
}
