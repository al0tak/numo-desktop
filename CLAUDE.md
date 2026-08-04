# numo-desktop

Electron + React + TypeScript invoice creator, built with electron-vite.

## Prefer native

**Whenever the platform already does something, let it.** Do not rebuild what the OS provides.

Concretely: the window is a stock `BrowserWindow` — the OS draws the title bar, the frame, the corners and the window controls, and the renderer only ever fills the client area. No `titleBarStyle`, no `trafficLightPosition`, no `titleBarOverlay`, no `-webkit-app-region` drag strip, no window-radius tokens.

The same applies inside the renderer: native form controls, `<dialog>`, the Popover API, and OS-driven behavior like `color-scheme` come before anything hand-rolled. Custom chrome is a last resort that needs a reason, and it carries a maintenance cost the platform version does not — traffic-light offsets, corner radii and title-bar heights all drift with each OS release.

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
