# numo-desktop

Electron + React + TypeScript invoice creator, built with electron-vite.

## Styling

**CSS Modules** (`*.module.css`) with CSS custom properties for tokens. Built into Vite — no plugin, no runtime.

Do not add Tailwind, shadcn/ui, or a CSS-in-JS library. Keep the dependency count minimal.

For accessible behavior, prefer the platform first — the renderer is Chromium-only, so `<dialog>`, the Popover API, CSS anchor positioning, and native form controls are all fair game. If a component genuinely needs more (combobox, roving-tabindex menu), add a single headless primitive for that component only.
