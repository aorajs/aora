"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoraServer = void 0;
const react_1 = __importDefault(require("react"));
const components_1 = require("./components");
const history_1 = require("history");
function AoraServer({ context, url, children }) {
    if (typeof url === 'string') {
        url = new URL(url);
    }
    let location = {
        pathname: url.pathname,
        search: url.search,
        hash: '',
        state: null,
        key: 'default',
    };
    let staticNavigator = {
        createHref(to) {
            return typeof to === 'string' ? to : (0, history_1.createPath)(to);
        },
        push(to) {
            throw new Error(`You cannot use navigator.push() on the server because it is a stateless ` +
                `environment. This error was probably triggered when you did a ` +
                `\`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
        },
        replace(to) {
            throw new Error(`You cannot use navigator.replace() on the server because it is a stateless ` +
                `environment. This error was probably triggered when you did a ` +
                `\`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere ` +
                `in your app.`);
        },
        go(delta) {
            throw new Error(`You cannot use navigator.go() on the server because it is a stateless ` +
                `environment. This error was probably triggered when you did a ` +
                `\`navigate(${delta})\` somewhere in your app.`);
        },
        back() {
            throw new Error(`You cannot use navigator.back() on the server because it is a stateless ` +
                `environment.`);
        },
        forward() {
            throw new Error(`You cannot use navigator.forward() on the server because it is a stateless ` +
                `environment.`);
        },
        block() {
            throw new Error(`You cannot use navigator.block() on the server because it is a stateless ` +
                `environment.`);
        },
    };
    return (react_1.default.createElement(components_1.AoraEntry, { context: context, action: history_1.Action.Pop, location: location, base: '/', navigator: staticNavigator, static: true, children: children }));
}
exports.AoraServer = AoraServer;
