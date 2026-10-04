# numo-desktop

Electron + React + TypeScript invoice creator, built with electron-vite.

## Prefer native

**Whenever the platform already does something, let it.** Do not rebuild what the OS provides.

Native form controls, `<dialog>`, the Popover API, and OS-driven behavior like `color-scheme` come before anything hand-rolled. Where the OS still draws something — the window frame, its corners, the window controls — leave it alone rather than reproducing it. Anything hand-rolled needs a reason, and it carries a maintenance cost the platform version does not.

## Exports

**Named exports only — no default exports**, anywhere. A named export keeps one canonical name for a symbol across every import site, so renames and find-all-references stay reliable.

## Components

One folder per component under `src/renderer/src/components/`, holding the component, its stylesheet, and an `index.ts` barrel that re-exports the component and its props type:

```
components/Button/
  Button.tsx
  Button.module.css
  index.ts
```

## Styling

**CSS Modules** (`*.module.css`) with CSS custom properties for tokens. Built into Vite — no plugin, no runtime.

Do not add Tailwind, shadcn/ui, or a CSS-in-JS library. Keep the dependency count minimal.

The renderer is Chromium-only, so CSS anchor positioning and other modern-only features are fair game. If a component genuinely needs behavior the platform has no answer for (combobox, roving-tabindex menu), add a single headless primitive for that component only.
