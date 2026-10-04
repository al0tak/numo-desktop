import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect
} from '@tanstack/react-router'
import { App } from './App'
import { EditorPage } from './pages/EditorPage'
import { HomePage } from './pages/HomePage'

// Hash routing: the packaged app is loaded from file://, where path-based
// routing has no server to fall back on.
//
// The root route is the window itself — the tab bar and everything that
// outlives a page — and the pages render into its outlet.
const rootRoute = createRootRoute({ component: App })

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
})

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'editor/$documentId',
  component: EditorPage
})

// Anything the routes do not know goes home rather than to an error page.
const fallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  beforeLoad: () => {
    throw redirect({ to: '/', replace: true })
  }
})

const routeTree = rootRoute.addChildren([homeRoute, editorRoute, fallbackRoute])

export const router = createRouter({ routeTree, history: createHashHistory() })

// Types every <Link to> and navigate() against the app's routes, so naming a
// page that does not exist fails to compile.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
