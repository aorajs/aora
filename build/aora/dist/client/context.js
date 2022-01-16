"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAoraContext = exports.context = exports.STORE_CONTEXT = void 0;
const react_1 = require("react");
function getContext() {
    let context;
    // @ts-ignore
    if (typeof window !== "undefined" && window.HTMLElement) {
        // @ts-ignore
        context = (window.STORE_CONTEXT || (0, react_1.createContext)({ state: {}, }));
        // @ts-ignore
        // window.STORE_CONTEXT = context;
    }
    else {
        context = (0, react_1.createContext)({
            state: {},
        });
    }
    return context;
}
exports.STORE_CONTEXT = getContext();
exports.context = exports.STORE_CONTEXT;
const useAoraContext = () => {
    return (0, react_1.useContext)(exports.STORE_CONTEXT);
};
exports.useAoraContext = useAoraContext;
