# numo-desktop

Electron + React + TypeScript invoice creator, built with electron-vite.

## Exports

**Named exports only — no default exports**, anywhere. A named export keeps one canonical name for a symbol across every import site, so renames and find-all-references stay reliable.

## Components

One folder per component under `src/renderer/src/components/`, holding the component and an `index.ts` barrel that re-exports the component and its props type:

```
components/DocumentTab/
  DocumentTab.tsx
  index.ts
```

### Primitives

`components/primitives/` holds the shadcn/ui components, one folder each in the same shape (`primitives/Button/Button.tsx` + an `index.ts` that re-exports everything). They are the building blocks: use them as-is where they fit (Button, Input), and do composition in a regular component outside the folder rather than inside the primitive.

A primitive may be tweaked to match the theme — sizes, tokens, focus ring — or to fit a desktop window, but keep it close to upstream and note any behavioral change in a comment at the top of the file (see `Sidebar`).

To add one:

```bash
npx shadcn@latest add <name>
```

The CLI writes a flat `primitives/<name>.tsx` with `@/` imports. Move it into `primitives/<Name>/<Name>.tsx`, add the barrel, switch its `@/components/primitives/…` imports to relative ones (`../Button`), and run `npm run format`.

## Styling

**Tailwind CSS v4** utilities, written in the component's `className`. Join conditional or overridable classes with `cn()` from the [`cn`](https://github.com/shadcn-ui/cn) package (shadcn's replacement for clsx + tailwind-merge), so a caller's `className` wins over a component's own. No CSS Modules, and no CSS-in-JS library.

Tokens live in `src/renderer/src/index.css`, named the way shadcn expects (`--background`, `--primary`, `--ring`, `--sidebar`…) plus the app's own (`--surface`, `--canvas`, `--accent-active`, `--control-height`, `--titlebar-height`, `--gap`…), and are mapped to utilities in `@theme inline`. Colours use `light-dark()`, so `color-scheme` — driven by `[data-theme]` and the OS — themes everything. The `dark:` variant is tied to the same switch; prefer a `light-dark()` token over a `dark:` utility.

Layout values that are not on Tailwind's scale go through the variable rather than a magic number: `h-(--control-height)`, `gap-(--gap)`. The window's drag region is `app-region-drag` / `app-region-no-drag`.

The renderer is Chromium-only, so CSS anchor positioning and other modern-only features are fair game.
