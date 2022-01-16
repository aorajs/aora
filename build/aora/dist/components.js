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
function Routes() {
    // TODO: Add `renderMatches` function to RR that we can use and then we don't
    // need this component, we can just `renderMatches` from RemixEntry
    let { clientRoutes } = useAoraEntryContext();
    // fallback to the root if we don't have a match
    let element = (0, react_router_dom_1.useRoutes)(clientRoutes) || clientRoutes[0].element;
    return element;
}
const AoraEntryContext = react_1.default.createContext(undefined);
function dedupe(array) {
    return [...new Set(array)];
}
function useAoraEntryContext() {
    // invariant(context, "You must render this element inside a <Remix> element");
    let context = react_1.default.useContext(AoraEntryContext);
    console.log('context', context);
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
                react_1.default.createElement(react_router_dom_1.Router, { navigationType: action, location: historyLocation, navigator: _navigator, static: staticProp },
                    react_1.default.createElement(Routes, null))))));
}
exports.AoraEntry = AoraEntry;
