"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverRender = void 0;
const React = __importStar(require("react"));
// @ts-ignore
const react_router_dom_1 = require("react-router-dom");
// @ts-ignore
const aora_1 = require("aora");
const serialize_javascript_1 = __importDefault(require("serialize-javascript"));
// @ts-expect-error
const ssr_temporary_routes_1 = require("_build/ssr-temporary-routes");
// @ts-ignore
const context_1 = require("aora/context");
// @ts-ignore
const index_tsx_1 = __importDefault(require("@/layouts/index.tsx"));
// declare const global: IGlobal
const serverRender = async (ctx, config) => {
    var _a;
    const { cssOrder, jsOrder, dynamic, ssr = true, parallelFetch, prefix } = config;
    // global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
    let path = ctx.request.path; // 这里取 pathname 不能够包含 queryString
    const base = prefix !== null && prefix !== void 0 ? prefix : ssr_temporary_routes_1.PrefixRouterBase; // 以开发者实际传入的为最高优先级
    if (base) {
        path = (0, aora_1.normalizePath)(config, path, base);
    }
    const routeItem = (0, aora_1.findRoute)(ssr_temporary_routes_1.FeRoutes, path);
    if (!routeItem) {
        throw new Error(`
    查找组件失败，请确认当前 path: ${path} 对应前端组件是否存在
    若创建了新的页面文件夹，请重新执行 npm start 重启服务
    `);
    }
    let dynamicCssOrder = cssOrder;
    if (dynamic) {
        dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`]);
        dynamicCssOrder = await (0, aora_1.addAsyncChunk)(dynamicCssOrder, routeItem.webpackChunkName);
    }
    const manifest = await (0, aora_1.getManifest)(config);
    const injectCss = [];
    const preloadCss = [];
    dynamicCssOrder.forEach((css) => {
        if (manifest[css]) {
            const item = manifest[css];
            injectCss.push(React.createElement("link", { rel: 'stylesheet', key: item, href: item }));
            preloadCss.push(React.createElement("link", { rel: "preload", key: item, href: item, as: "style" }));
        }
    });
    // if (disableClientRender) {
    //   injectCss.push(<script key="disableClientRender" dangerouslySetInnerHTML={{
    //     __html: 'window.__disableClientRender__ = true'
    //   }}/>)
    // }
    const injectScript = jsOrder.map((js) => manifest[js]).map((item) => React.createElement("script", { key: item, src: item, async: true }));
    const preloadScript = jsOrder.map((js) => manifest[js]).map((item) => React.createElement("link", { rel: "preload", as: "script", key: item, href: item }));
    const staticList = {
        injectCss,
        injectScript,
        preloadScript,
        preloadCss,
    };
    const isCsr = !!(!ssr || ((_a = ctx.request.query) === null || _a === void 0 ? void 0 : _a.csr));
    const { component, fetch } = routeItem;
    const { default: Component, fetch: compFetch } = (await component());
    let layoutFetchData = {};
    let fetchData = {};
    if (!isCsr) {
        const currentFetch = compFetch ? compFetch : (fetch ? (await fetch()).default : null);
        // csr 下不需要服务端获取数据
        if (parallelFetch) {
            [layoutFetchData, fetchData] = await Promise.all([
                ssr_temporary_routes_1.layoutFetch ? (0, ssr_temporary_routes_1.layoutFetch)({ ctx }) : Promise.resolve({}),
                currentFetch ? currentFetch({ ctx }) : Promise.resolve({})
            ]);
        }
        else {
            layoutFetchData = ssr_temporary_routes_1.layoutFetch ? await (0, ssr_temporary_routes_1.layoutFetch)({ ctx }) : {};
            fetchData = currentFetch ? await currentFetch({ ctx }) : {};
        }
    }
    const combineData = isCsr ? null : Object.assign(ssr_temporary_routes_1.state !== null && ssr_temporary_routes_1.state !== void 0 ? ssr_temporary_routes_1.state : {}, layoutFetchData !== null && layoutFetchData !== void 0 ? layoutFetchData : {}, fetchData !== null && fetchData !== void 0 ? fetchData : {});
    const injectState = isCsr ? null : React.createElement("script", { dangerouslySetInnerHTML: {
            __html: `window.__USE_SSR__=true;window.__INITIAL_DATA__=${(0, serialize_javascript_1.default)(combineData)};window.pageProps=${(0, serialize_javascript_1.default)(fetchData)}`
        } });
    return (React.createElement(react_router_dom_1.StaticRouter, { location: ctx.request.url, basename: base },
        React.createElement(context_1.STORE_CONTEXT.Provider, { value: { state: combineData } },
            React.createElement(index_tsx_1.default, { ctx: ctx, config: config, staticList: staticList, injectState: injectState, state: combineData }, isCsr ? React.createElement(React.Fragment, null) : React.createElement(Component, { ...fetchData })))));
};
exports.serverRender = serverRender;
