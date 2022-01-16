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
exports.AppContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
// @ts-ignore
const context_1 = require("aora/context");
// @ts-expect-error
const Routes = __importStar(require("_build/ssr-temporary-routes"));
const { reducer, state } = Routes;
const userState = state !== null && state !== void 0 ? state : {};
const userReducer = reducer !== null && reducer !== void 0 ? reducer : function () { };
const isDev = process.env.NODE_ENV !== 'production';
function defaultReducer(state, action) {
    switch (action.type) {
        case 'updateContext':
            if (isDev) {
                console.log('[SSR:updateContext]: dispatch updateContext with action');
                console.log(action);
            }
            return { ...state, ...action.payload };
    }
}
const initialState = Object.assign({}, userState !== null && userState !== void 0 ? userState : {}, window.__INITIAL_DATA__);
function combineReducer(state, action) {
    return defaultReducer(state, action) || userReducer(state, action);
}
function AppContext(props) {
    const [state, dispatch] = (0, react_1.useReducer)(combineReducer, initialState);
    return (React.createElement(context_1.STORE_CONTEXT.Provider, { value: { state, dispatch } }, props.children));
}
exports.AppContext = AppContext;
