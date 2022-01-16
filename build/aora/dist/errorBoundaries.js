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
exports.AoraRootDefaultCatchBoundary = exports.AoraCatchBoundary = exports.useCatch = exports.AoraErrorBoundary = void 0;
const react_1 = __importStar(require("react"));
class AoraErrorBoundary extends react_1.default.Component {
    render() {
        return this.props.children;
    }
}
exports.AoraErrorBoundary = AoraErrorBoundary;
let AoraCatchContext = react_1.default.createContext(undefined);
function useCatch() {
    return (0, react_1.useContext)(AoraCatchContext);
}
exports.useCatch = useCatch;
function AoraCatchBoundary({ catch: catchVal, component: Component, children, }) {
    if (catchVal) {
        return (react_1.default.createElement(AoraCatchContext.Provider, { value: catchVal },
            react_1.default.createElement(Component, null)));
    }
    return react_1.default.createElement(react_1.default.Fragment, null, children);
}
exports.AoraCatchBoundary = AoraCatchBoundary;
/**
 * When app's don't provide a root level CatchBoundary, we default to this.
 */
function AoraRootDefaultCatchBoundary() {
    let caught = useCatch();
    return (react_1.default.createElement("html", { lang: 'en' },
        react_1.default.createElement("head", null,
            react_1.default.createElement("meta", { charSet: 'utf-8' }),
            react_1.default.createElement("meta", { name: 'viewport', content: 'width=device-width,initial-scale=1,viewport-fit=cover' }),
            react_1.default.createElement("title", null, "Unhandled Thrown Response!")),
        react_1.default.createElement("body", null,
            react_1.default.createElement("h1", { style: { fontFamily: 'system-ui, sans-serif', padding: '2rem' } },
                caught.status,
                " ",
                caught.statusText),
            react_1.default.createElement("script", { dangerouslySetInnerHTML: {
                    __html: `
              console.log(
                "💿 Hey developer👋. You can provide a way better UX when your app throws 404s (and other responses) than this. Check out https://remix.run/guides/not-found for more information."
              );
            `,
                } }))));
}
exports.AoraRootDefaultCatchBoundary = AoraRootDefaultCatchBoundary;
