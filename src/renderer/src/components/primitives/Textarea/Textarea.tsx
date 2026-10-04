import * as React from 'react'
import { cn } from 'cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-[calc(2lh+var(--control-padding)*2)] max-h-[calc(10lh+var(--control-padding)*2)] w-full resize-none rounded-md border border-input bg-control px-(--control-padding) py-[calc(var(--control-padding)-2px)] text-sm leading-[1.45] transition-[color,box-shadow,border-color] outline-none hover:not-focus-visible:border-input-hover placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
