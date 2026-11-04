import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { AtlasPage } from './shell/atlas/AtlasPage'
import { parseAtlasSearch } from './shell/atlas/route'
import { TomePage } from './shell/TomePage'
import { NotFound } from './shell/NotFound'
import { GlobalSearchProvider } from './shell/GlobalSearch'

// Every route sits inside the universal search, so Ctrl+K works on the Atlas and in any tome.
function RootLayout() {
  return (
    <GlobalSearchProvider>
      <Outlet />
    </GlobalSearchProvider>
  )
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

const atlasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: parseAtlasSearch,
  component: AtlasPage,
})

// `$` is a splat: everything after the tome id is handed to the tome as `path`,
// so each tome is free to organise its own internal navigation.
const tomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tomes/$tomeId/$',
  component: TomePage,
})

const tomeIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tomes/$tomeId',
  component: TomePage,
})

export const router = createRouter({
  routeTree: rootRoute.addChildren([atlasRoute, tomeIndexRoute, tomeRoute]),
  // Hash history works identically in the browser and inside Tauri, offline.
  history: createHashHistory(),
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
