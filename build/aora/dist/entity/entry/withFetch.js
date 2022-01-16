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
exports.withFetch = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
// @ts-ignore
const react_router_dom_1 = require("react-router-dom");
// @ts-ignore
const context_1 = require("aora/context");
let hasRender = false;
const fetchAndDispatch = async ({ fetch, layoutFetch }, dispatch, routerProps, state) => {
    let asyncLayoutData = {};
    let asyncData = {};
    if (layoutFetch) {
        asyncLayoutData = await layoutFetch({ routerProps, state });
    }
    if (fetch) {
        asyncData = await fetch({ routerProps, state });
    }
    const combineData = Object.assign({}, asyncLayoutData, asyncData);
    await (dispatch === null || dispatch === void 0 ? void 0 : dispatch({
        type: "updateContext",
        payload: combineData,
    }));
    return asyncData;
};
function withFetch(WrappedComponent) {
    return (0, react_router_dom_1.withRouter)(function withRouter(props) {
        const { state, dispatch } = (0, react_1.useContext)(context_1.STORE_CONTEXT);
        // @ts-ignore
        const [pageProps, setPageProps] = (0, react_1.useState)({ ...window.pageProps || {} });
        (0, react_1.useEffect)(() => {
            didMount();
        }, []);
        const didMount = async () => {
            if (hasRender || !window.__USE_SSR__) {
                // ssr 情况下只有路由切换的时候才需要调用 fetch
                // csr 情况首次访问页面也需要调用 fetch
                const { layoutFetch, fetch } = WrappedComponent;
                const _pageProps = await fetchAndDispatch({ fetch, layoutFetch }, dispatch, props, state);
                setPageProps(_pageProps);
            }
            hasRender = true;
        };
        return React.createElement(WrappedComponent, { ...pageProps, ...props });
    });
}
exports.withFetch = withFetch;
