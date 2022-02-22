import { ReactESMFeRouteItem } from '@aora/types';

export const normalizePath = (path: string, prefix: string) => {
  path = path.replace(prefix!, '');
  if (path.startsWith('//')) {
    path = path.replace('//', '/');
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
};

export const preloadComponent = async (
  Routes: ReactESMFeRouteItem[],
  PrefixRouterBase?: string,
) => {
  for (const route of Routes) {
    const { component } = route as any;
    let pathname = location.pathname;
    if (PrefixRouterBase) {
      pathname = normalizePath(pathname, PrefixRouterBase);
    }
    if (component.name === 'dynamicComponent') {
      const Component = await component();
      route.component = Component.default;
      route.fetch = Component.fetch;
    }
  }
  return Routes;
};
