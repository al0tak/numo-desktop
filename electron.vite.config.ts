import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    // The main process is bundled to CommonJS while dependencies stay external.
    // ESM-only ones (electron-store) come back from require() as a namespace
    // object, so the default export has to be unwrapped rather than assumed.
    build: { rollupOptions: { output: { interop: 'auto' } } }
  },
  preload: {},
  renderer: {
    // React Compiler memoizes components at build time, so the renderer should
    // not need useMemo/useCallback by hand. It targets React 19 by default,
    // which matches the installed react/react-dom.
    plugins: [react({ babel: { plugins: ['babel-plugin-react-compiler'] } })]
  }
})
