"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoraEntry = exports.useAoraEntryContext = void 0;
const react_1 = __importDefault(require("react"));
// import { Router } from 'react-router';
const errorBoundaries_1 = require("./errorBoundaries");
const invariant_1 = __importDefault(require("./invariant"));
const react_router_dom_1 = require("react-router-dom");
const AoraEntryContext = react_1.default.createContext(undefined);
function dedupe(array) {
    return [...new Set(array)];
}
function useAoraEntryContext() {
    // invariant(context, "You must render this element inside a <Remix> element");
    let context = react_1.default.useContext(AoraEntryContext);
    (0, invariant_1.default)(context, 'You must render this element inside a <Aora> element');
    return context;
}
exports.useAoraEntryContext = useAoraEntryContext;
function AoraEntry({ location: historyLocation, base: base, navigator: _navigator, context: context, static: staticProp = false, action, children, }) {
    // let clientRoutes = React.useMemo(
    //   () => createClientRoutes(manifest.routes, routeModules, RemixRoute),
    //   [manifest, routeModules]
    // );
    let navigator = react_1.default.useMemo(() => {
        let push = (to, state) => {
            return _navigator.push(to, state);
        };
        return { ..._navigator, push };
    }, [_navigator]);
    return (react_1.default.createElement(AoraEntryContext.Provider, { value: {} },
        react_1.default.createElement(errorBoundaries_1.AoraErrorBoundary, { location: historyLocation, error: undefined },
            react_1.default.createElement(errorBoundaries_1.AoraCatchBoundary, { location: historyLocation, component: errorBoundaries_1.AoraRootDefaultCatchBoundary, catch: undefined },
                react_1.default.createElement(react_router_dom_1.Router, { navigationType: action, location: historyLocation, navigator: _navigator, static: staticProp }, children)))));
}
exports.AoraEntry = AoraEntry;
