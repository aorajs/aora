"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const path_1 = require("path");
const server_1 = require("react-dom/server");
const utils_1 = require("./utils");
const cwd = (0, utils_1.getCwd)();
const defaultConfig = (0, utils_1.loadConfig)();
const { chunkName } = defaultConfig;
async function render(ctx, options) {
    var _a, _b, _c, _d;
    const config = Object.assign({}, defaultConfig, options !== null && options !== void 0 ? options : {});
    const { isDev } = config;
    console.log(options);
    const { request } = ctx;
    const url = new URL(request.url, `http://${request.headers.host}`);
    const isLocal = isDev || process.env.NODE_ENV !== 'production';
    const serverFile = (0, path_1.resolve)(cwd, `./.aora/server/${chunkName}.server.js`);
    if (isLocal) {
        // clear cache in development environment
        delete require.cache[serverFile];
    }
    const { AoraServer2: serverRender } = require(serverFile);
    // const serverRes = await serverRender({ context: ctx, base: '/', url });
    const serverRes = await serverRender({ context: ctx, base: '/', url });
    if (!((_b = (_a = ctx.response).hasHeader) === null || _b === void 0 ? void 0 : _b.call(_a, 'content-type'))) {
        // express 场景
        (_d = (_c = ctx.response).setHeader) === null || _d === void 0 ? void 0 : _d.call(_c, 'Content-type', 'text/html;charset=utf-8');
    }
    try {
        const markup = (0, server_1.renderToString)(serverRes);
        return '<!DOCTYPE html>' + markup;
    }
    catch (e) {
        console.log(e);
    }
}
exports.render = render;
exports.default = render;
