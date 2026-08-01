# numo-desktop

Electron + React + TypeScript invoice creator, built with electron-vite.

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

For accessible behavior, prefer the platform first — the renderer is Chromium-only, so `<dialog>`, the Popover API, CSS anchor positioning, and native form controls are all fair game. If a component genuinely needs more (combobox, roving-tabindex menu), add a single headless primitive for that component only.
