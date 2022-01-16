"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFeRoutes = exports.getImageOutputPath = exports.getOutputPublicPath = exports.normalizePublicPath = exports.normalizePath = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const cwd_1 = require("./cwd");
const debug = require('debug')('ssr:parse');
const pageDir = (0, cwd_1.getPagesDir)();
const cwd = (0, cwd_1.getCwd)();
const getPrefix = (prefix) => {
    return prefix ? (0, cwd_1.normalizeStartPath)(prefix) : prefix;
};
const normalizePath = (config, path, base) => {
    const prefix = getPrefix(config.prefix);
    // 移除 prefix 保证 path 跟路由表能够正确匹配
    const baseName = base !== null && base !== void 0 ? base : prefix;
    if (baseName) {
        path = path.replace(baseName, '');
    }
    if (path.startsWith('//')) {
        path = path.replace('//', '/');
    }
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }
    return path;
};
exports.normalizePath = normalizePath;
const normalizePublicPath = (path) => {
    // 兼容 /pre /pre/ 两种情况
    if (!path.endsWith('/')) {
        path = `${path}/`;
    }
    return path;
};
exports.normalizePublicPath = normalizePublicPath;
const getOutputPublicPath = (publicPath, isDev) => {
    const path = (0, exports.normalizePublicPath)(publicPath);
    return isDev ? path : `${path}_aora/`;
};
exports.getOutputPublicPath = getOutputPublicPath;
const getImageOutputPath = (publicPath, isDev) => {
    const imagePath = 'static/images';
    const normalizePath = (0, exports.normalizePublicPath)(publicPath);
    return {
        publicPath: isDev ? `${normalizePath}${imagePath}` : `${normalizePath}_aora/${imagePath}`,
        imagePath
    };
};
exports.getImageOutputPath = getImageOutputPath;
const parseFeRoutes = async (config) => {
    const { dynamic, routerPriority, routerOptimize } = config;
    const prefix = getPrefix(config.prefix);
    let routes = '';
    const declaretiveRoutes = await (0, cwd_1.accessFile)((0, path_1.join)((0, cwd_1.getFeDir)(), './route.ts')); // 是否存在自定义路由
    if (!declaretiveRoutes) {
        // 根据目录结构生成前端路由表
        const pathRecord = ['']; // 路径记录
        // @ts-ignore
        const route = {};
        let arr = await renderRoutes(pageDir, pathRecord, route);
        if (routerPriority) {
            // 路由优先级排序
            arr.sort((a, b) => {
                // 没有显示指定的路由优先级统一为 0
                return (routerPriority[b.path] || 0) - (routerPriority[a.path] || 0);
            });
        }
        if (routerOptimize) {
            // 路由过滤
            if (routerOptimize.include && routerOptimize.exclude) {
                throw new Error('include and exclude cannot exist synchronal');
            }
            if (routerOptimize.include) {
                arr = arr.filter(route => { var _a; return (_a = routerOptimize === null || routerOptimize === void 0 ? void 0 : routerOptimize.include) === null || _a === void 0 ? void 0 : _a.includes(route.path); });
            }
            if (routerOptimize.exclude) {
                arr = arr.filter(route => { var _a; return !((_a = routerOptimize === null || routerOptimize === void 0 ? void 0 : routerOptimize.exclude) === null || _a === void 0 ? void 0 : _a.includes(route.path)); });
            }
        }
        debug('Before the result that parse web folder to routes is: ', arr);
        // React 场景
        const accessReactApp = await (0, cwd_1.accessFile)((0, path_1.join)((0, cwd_1.getFeDir)(), './layouts/App.tsx'));
        const layoutFetch = await (0, cwd_1.accessFile)((0, path_1.join)((0, cwd_1.getFeDir)(), './layouts/fetch.ts'));
        const accessStore = await (0, cwd_1.accessFile)((0, path_1.join)((0, cwd_1.getFeDir)(), './store/index.ts'));
        const re = /"webpackChunkName":("(.+?)")/g;
        routes = `
    // The file is provisional，don't depend on it 
      export const FeRoutes = ${JSON.stringify(arr)} 
      ${accessReactApp ? 'export { default as App, fetch as layoutFetch } from "@/layouts/App.tsx"' : ''}
      ${layoutFetch ? 'export { default as layoutFetch } from "@/layouts/fetch.ts"' : ''}
      ${accessStore ? 'export * from "@/store/index.ts"' : ''}
      ${prefix ? `export const PrefixRouterBase='${prefix}'` : ''}

      `;
        routes = routes.replace(/"component":("(.+?)")/g, (_global, _m1, m2) => {
            const currentWebpackChunkName = re.exec(routes)[2];
            if (dynamic) {
                return `"component": function dynamicComponent () {
          return import(/* webpackChunkName: "${currentWebpackChunkName}" */ '${m2.replace(/\^/g, '"')}')
        }
        `;
            }
            else {
                return `"component": require('${m2.replace(/\^/g, '"')}').default`;
            }
        });
        re.lastIndex = 0;
        routes = routes.replace(/"fetch":("(.+?)")/g, (_global, _m1, m2) => {
            const currentWebpackChunkName = re.exec(routes)[2];
            return `"fetch": () => import(/* webpackChunkName: "${currentWebpackChunkName}-fetch" */ '${m2.replace(/\^/g, '"')}')`;
        });
    }
    else {
        // 使用了声明式路由
        routes = (await fs_1.promises.readFile((0, path_1.join)((0, cwd_1.getFeDir)(), './route.ts'))).toString();
    }
    debug('After the result that parse web folder to routes is: ', routes);
    await writeRoutes(routes);
};
exports.parseFeRoutes = parseFeRoutes;
const writeRoutes = async (routes) => {
    await fs_1.promises.writeFile((0, path_1.resolve)(cwd, './.aora/ssr-temporary-routes.js'), routes);
};
const renderRoutes = async (pageDir, pathRecord, route) => {
    let arr = [];
    const pagesFolders = await fs_1.promises.readdir(pageDir);
    const prefixPath = pathRecord.join('/');
    const aliasPath = `@/pages${prefixPath}`;
    const routeArr = [];
    const fetchExactMatch = pagesFolders.filter(p => p.includes('fetch'));
    for (const pageFiles of pagesFolders) {
        const abFolder = (0, path_1.join)(pageDir, pageFiles);
        const isDirectory = (await fs_1.promises.stat(abFolder)).isDirectory();
        if (isDirectory) {
            // 如果是文件夹则递归下去, 记录路径
            pathRecord.push(pageFiles);
            const childArr = await renderRoutes(abFolder, pathRecord, Object.assign({}, route));
            pathRecord.pop(); // 回溯
            arr = arr.concat(childArr);
        }
        else {
            // 遍历一个文件夹下面的所有文件
            if (!pageFiles.includes('render')) {
                continue;
            }
            // 拿到具体的文件
            if (pageFiles.includes('render$')) {
                /* /news/:id */
                route.path = `${prefixPath}/:${getDynamicParam(pageFiles)}`;
                route.component = `${aliasPath}/${pageFiles}`;
                let webpackChunkName = pathRecord.join('-');
                if (webpackChunkName.startsWith('-')) {
                    webpackChunkName = webpackChunkName.replace('-', '');
                }
                route.webpackChunkName = `${webpackChunkName}-${getDynamicParam(pageFiles).replace(/\/:\??/g, '-').replace('?', '-optional')}`;
            }
            else if (pageFiles.includes('render')) {
                /* /news */
                route.path = `${prefixPath}`;
                route.component = `${aliasPath}/${pageFiles}`;
                let webpackChunkName = pathRecord.join('-');
                if (webpackChunkName.startsWith('-')) {
                    webpackChunkName = webpackChunkName.replace('-', '');
                }
                route.webpackChunkName = webpackChunkName;
            }
            if (fetchExactMatch.length >= 2) {
                // fetch文件数量 >=2 启用完全匹配策略 render$id => fetch$id, render => fetch
                const fetchPageFiles = `${pageFiles.replace('render', 'fetch').split('.')[0]}.ts`;
                if (fetchExactMatch.includes(fetchPageFiles)) {
                    route.fetch = `${aliasPath}/${fetchPageFiles}`;
                }
            }
            else if (fetchExactMatch.includes('fetch.ts')) {
                // 单 fetch 文件的情况 所有类型的 render 都对应该 fetch
                route.fetch = `${aliasPath}/fetch.ts`;
            }
            routeArr.push({ ...route });
        }
    }
    routeArr.forEach((r) => {
        var _a;
        if ((_a = r.path) === null || _a === void 0 ? void 0 : _a.includes('index')) {
            // /index 映射为 /
            if (r.path.split('/').length >= 3) {
                r.path = r.path.replace('/index', '');
            }
            else {
                r.path = r.path.replace('index', '');
            }
        }
        r.path && arr.push(r);
    });
    return arr;
};
const getDynamicParam = (url) => {
    return url.split('$').filter(r => r !== 'render' && r !== '').map(r => r.replace(/\.[\s\S]+/, '').replace('#', '?')).join('/:');
};
