// @ts-nocheck
import { ReactClientESMFeRouteItem } from '../types'
import { pathToRegexp } from 'path-to-regexp'
import { normalizePath } from './utils'

const preloadComponent = async (Routes: ReactClientESMFeRouteItem[], PrefixRouterBase?: string) => {
  for (const route of Routes) {
    const { component, path } = route
    let pathname = location.pathname
    if (PrefixRouterBase) {
      pathname = normalizePath(pathname, PrefixRouterBase)
    }
    if (component.name === 'dynamicComponent') {
      const Component = (await component())
      route.component = Component.default
      route.fetch = Component.fetch
    }
  }
  return Routes
}

export { preloadComponent }
