"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRoute = void 0;
// @ts-nocheck
const path_to_regexp_1 = require("path-to-regexp");
const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;
function compilePath(path, options) {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
    const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
    if (pathCache[path])
        return pathCache[path];
    const keys = [];
    const regexp = (0, path_to_regexp_1.pathToRegexp)(path, keys, options);
    const result = { regexp, keys };
    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++;
    }
    return result;
}
function matchPath(pathname, options = {}) {
    if (typeof options === 'string' || Array.isArray(options)) {
        options = { path: options };
    }
    const { path, exact = false, strict = false, sensitive = false } = options;
    const paths = [].concat(path);
    return paths.reduce((matched, path) => {
        if (!path && path !== '')
            return null;
        if (matched)
            return matched;
        const { regexp, keys } = compilePath(path, {
            end: exact,
            strict,
            sensitive
        });
        const match = regexp.exec(pathname);
        if (!match)
            return null;
        const [url, ...values] = match;
        const isExact = pathname === url;
        if (exact && !isExact)
            return null;
        return {
            path,
            url: path === '/' && url === '' ? '/' : url,
            isExact,
            params: keys.reduce((memo, key, index) => {
                memo[key.name] = values[index];
                return memo;
            }, {})
        };
    }, null);
}
function findRoute(Routes, path) {
    // 根据请求的path来匹配到对应的Component
    return Routes.find(route => matchPath(path, route) && matchPath(path, route).isExact);
}
exports.findRoute = findRoute;
