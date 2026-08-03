import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The renderer on its own, in a browser: `npm run dev:renderer`, then open the
// editor at http://localhost:5199/#/editor.
//
// Faster to reload than the full app, and it opens the renderer to anything
// that drives a browser. It is not a substitute for `npm run dev` — there is no
// main process behind it, so `window.store` is undefined and every page that
// reaches for it fails.
export default defineConfig({
  root: 'src/renderer',
  plugins: [react()],
  server: { port: 5199 }
})
