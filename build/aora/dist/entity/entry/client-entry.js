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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRender = void 0;
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
// @ts-ignore
const react_router_dom_1 = require("react-router-dom");
const preload_1 = require("./preload");
const withFetch_1 = require("./withFetch");
// @ts-expect-error
const Routes = __importStar(require("_build/ssr-temporary-routes"));
const app_context_1 = require("./app-context");
const { FeRoutes, layoutFetch, App, PrefixRouterBase } = Routes;
const clientRender = async () => {
    var _a, _b, _c;
    const IApp = App !== null && App !== void 0 ? App : function (props) {
        return props.children;
    };
    // 客户端渲染||hydrate
    const baseName = (_a = window.prefix) !== null && _a !== void 0 ? _a : PrefixRouterBase;
    const routes = await (0, preload_1.preloadComponent)(FeRoutes, baseName);
    ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render']((React.createElement(react_router_dom_1.BrowserRouter, { basename: baseName },
        React.createElement(app_context_1.AppContext, null,
            React.createElement(react_router_dom_1.Switch, null,
                React.createElement(IApp, null,
                    React.createElement(react_router_dom_1.Switch, null, 
                    // 使用高阶组件wrapComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
                    routes.map((item) => {
                        const { component, path, fetch } = item;
                        component.fetch = fetch;
                        component.layoutFetch = layoutFetch;
                        const WrappedComponent = (0, withFetch_1.withFetch)(component);
                        return (
                        // @ts-ignore
                        React.createElement(react_router_dom_1.Route, { exact: true, key: path, path: path, render: () => React.createElement(WrappedComponent, { key: location.pathname }) }));
                    }))))))), document.getElementById('app'));
    (_c = (_b = module === null || module === void 0 ? void 0 : module.hot) === null || _b === void 0 ? void 0 : _b.accept) === null || _c === void 0 ? void 0 : _c.call(_b); // webpack 场景下的 hmr
};
exports.clientRender = clientRender;
clientRender();
