"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialSSRDevProxy = void 0;
const __1 = require("..");
const proxy_1 = require("./proxy");
const initialSSRDevProxy = async (app, options) => {
    // 在本地开发阶段代理 serverPort 的资源到 fePort
    // 例如 http://localhost:3000/static/js/page.chunk.js -> http://localhost:8888/static/js/page.chunk.js
    const config = (0, __1.loadConfig)();
    const proxyMiddlewaresArr = await (0, proxy_1.getDevProxyMiddlewaresArr)(config, options);
    for (const middleware of proxyMiddlewaresArr) {
        app.use(middleware);
    }
};
exports.initialSSRDevProxy = initialSSRDevProxy;
__exportStar(require("./proxy"), exports);
