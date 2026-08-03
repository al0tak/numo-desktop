import js from '@eslint/js'
import babelParser from '@babel/eslint-parser'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

// TypeScript is parsed through Babel rather than typescript-eslint, because the
// project is on TypeScript 7 — the Go port, whose npm package ships the CLI and
// no JS compiler API, so typescript-eslint's parser cannot load. Babel is
// already in the renderer's pipeline for React Compiler, so this adds a parser
// rather than a second toolchain.
//
// The trade-off is that no rule here can see types. That split is deliberate:
// tsc owns everything type-shaped (including unused locals and parameters, via
// tsconfig), and ESLint owns the AST-level React rules it can check on its own.
const typescript = {
  languageOptions: {
    parser: babelParser,
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        babelrc: false,
        configFile: false,
        // preset-typescript reads the filename, so .tsx gets JSX and .ts does
        // not — which is what keeps `<T>` in a .ts file parsing as a generic.
        presets: ['@babel/preset-typescript']
      }
    }
  }
}

export default [
  { ignores: ['out/**', 'dist/**', 'node_modules/**'] },

  js.configs.recommended,

  // Type-only imports and type annotations are invisible to eslint-scope, which
  // has no notion of TS type positions, so every `import type` reads as unused.
  // tsc reports these properly under noUnusedLocals/noUnusedParameters.
  { rules: { 'no-unused-vars': 'off', 'no-undef': 'off' } },

  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    ...typescript
  },

  // Renderer: browser globals, React rules, and the React Compiler diagnostics.
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    ...typescript,
    languageOptions: {
      ...typescript.languageOptions,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      // v7 of this plugin ships the React Compiler's own diagnostics as
      // individual rules — immutability, purity, refs, set-state-in-render and
      // the rest are all in `recommended`. They are what makes a compiler
      // bailout visible: without them a component quietly stops being memoized.
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn'
    }
  },

  // Main and preload run in Node, not the browser.
  {
    files: ['src/main/**/*.ts', 'src/preload/**/*.ts', '*.config.{ts,mjs,js}'],
    languageOptions: { globals: globals.node }
  }
]
