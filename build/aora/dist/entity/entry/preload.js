"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadComponent = exports.normalizePath = void 0;
const normalizePath = (path, prefix) => {
    path = path.replace(prefix, '');
    if (path.startsWith('//')) {
        path = path.replace('//', '/');
    }
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }
    return path;
};
exports.normalizePath = normalizePath;
const preloadComponent = async (Routes, PrefixRouterBase) => {
    for (const route of Routes) {
        const { component } = route;
        let pathname = location.pathname;
        if (PrefixRouterBase) {
            pathname = (0, exports.normalizePath)(pathname, PrefixRouterBase);
        }
        if (component.name === 'dynamicComponent') {
            const Component = (await component());
            route.component = Component.default;
            route.fetch = Component.fetch;
        }
    }
    return Routes;
};
exports.preloadComponent = preloadComponent;
