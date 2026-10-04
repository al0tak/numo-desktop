import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { DocumentPage } from './DocumentPage'
import { FormatPage } from './FormatPage'

// The pages of the document pane. The document is the root; each setting
// group it lists is a page of its own that replaces it, with a way back.

const rootRoute = createRootRoute({ component: Outlet })

const documentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DocumentPage
})

const formatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'format',
  component: FormatPage
})

export const routeTree = rootRoute.addChildren([documentRoute, formatRoute])
