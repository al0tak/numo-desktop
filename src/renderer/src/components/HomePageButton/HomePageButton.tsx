import { cn } from 'cn'
import type { ComponentProps, ReactNode } from 'react'
import { Button } from '../primitives/Button'

export type HomePageButtonProps = ComponentProps<typeof Button> & {
  /** Rendered above the label and hidden from assistive tech. */
  icon?: ReactNode
}

// The large tinted action on the home screen: icon stacked over its label.
// Its colour is the Button's variant — primary for the loud action, secondary
// for a quiet one beside it.
export function HomePageButton({ icon, children, className, ...rest }: HomePageButtonProps) {
  return (
    <Button
      className={cn(
        'h-auto flex-col gap-2 rounded-xl px-7 py-4 text-[15px] leading-tight font-semibold select-none active:scale-[0.97] disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100 [&_svg:not([class*=size-])]:size-6',
        className
      )}
      {...rest}
    >
      {icon && (
        <span className="inline-flex" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Button>
  )
}
