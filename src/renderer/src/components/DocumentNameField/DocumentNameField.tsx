import { cn } from 'cn'
import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Input } from '../primitives/Input'

export type DocumentNameFieldProps = {
  name: string
  onRename: (name: string) => void
  className?: string
}

// The document's name, which a click turns into a field to rename it — the
// way Finder or a native title bar renames a file in place. Enter or leaving
// the field keeps the new name; Escape puts the old one back.
//
// At rest it reads as a heading rather than a control. The field that replaces
// it keeps the same box and the same inset for its text, so starting to type
// moves nothing.
export function DocumentNameField({ name, onRename, className }: DocumentNameFieldProps) {
  const [draft, setDraft] = useState<string | null>(null)

  const commit = () => {
    if (draft === null) return

    setDraft(null)
    const trimmed = draft.trim()
    if (trimmed !== name) onRename(trimmed)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commit()
    if (event.key === 'Escape') setDraft(null)
  }

  if (draft !== null) {
    return (
      <Input
        className={cn('font-semibold', className)}
        aria-label="Document name"
        value={draft}
        // Mounted by the click that asked for it, so taking focus here is the
        // click finishing what it started rather than focus being pulled away.
        autoFocus
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
      />
    )
  }

  return (
    <button
      type="button"
      className={cn(
        // The input's box: its height, and its padding plus its border's pixel
        // as the text's inset.
        'h-(--control-height) w-full min-w-0 cursor-default truncate rounded-md px-[calc(var(--control-padding)+1px)] text-left text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-3 focus-visible:-outline-offset-1 focus-visible:outline-ring',
        className
      )}
      title={`${name} — click to rename`}
      onClick={() => setDraft(name)}
    >
      {name}
    </button>
  )
}
