type ClassValue = string | false | null | undefined

// Joins CSS Module class names, dropping the falsy ones so conditionals read
// inline: cx(styles.button, isActive && styles.active, className).
//
// This is a local helper rather than clsx/classnames because the codebase is
// small and only ever needs strings and conditionals. It deliberately does NOT
// support the object form (`{ active: true }`), nested arrays, or number keys.
// If a feature needs any of those, flag it — that is the signal to swap this
// out for clsx rather than to grow the helper.
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
