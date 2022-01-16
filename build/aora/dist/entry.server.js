"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoraServer2 = void 0;
const react_1 = __importDefault(require("react"));
const server_1 = require("./server");
// @ts-ignore
const _document_tsx_1 = __importDefault(require("@/layouts/_document.tsx"));
async function serverRender(_ctx, _config, url) {
    return (react_1.default.createElement(server_1.AoraServer, { context: {}, url: url, base: '/' },
        react_1.default.createElement(_document_tsx_1.default, null)));
}
exports.default = serverRender;
async function AoraServer2({ context, base, url }) {
    return (react_1.default.createElement(server_1.AoraServer, { context: {}, url: url, base: '/' },
        react_1.default.createElement(_document_tsx_1.default, null)));
}
exports.AoraServer2 = AoraServer2;
