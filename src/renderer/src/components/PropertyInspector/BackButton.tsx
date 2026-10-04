import { ChevronLeft } from 'lucide-react'

export type BackButtonProps = {
  onClick: () => void
}

// Back to the document, from any page under it. It sits above the page's
// heading and quieter than it, nudged left so the chevron's empty side does not
// push it off the column's edge.
export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      className="-mb-1.5 -ml-1 inline-flex cursor-default items-center gap-0.5 self-start rounded-sm text-xs text-muted-foreground hover:text-foreground focus-visible:outline-3 focus-visible:-outline-offset-1 focus-visible:outline-ring"
      onClick={onClick}
    >
      <ChevronLeft className="size-3.5" aria-hidden="true" />
      Back
    </button>
  )
}
