"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startClientBuild = exports.startClientServer = void 0;
const webpack_1 = __importDefault(require("webpack"));
const config_1 = require("../entity/config");
const promisify_1 = require("./utils/promisify");
// fork 后移除 webpack-dev-server 默认的启动 log，只展示服务端 Node.js 的启动监听端口
const WebpackDevServer = require('webpack-dev-server-ssr');
const startClientServer = async (config) => {
    const { webpackDevServerConfig, fePort, host } = config;
    const webpackConfig = (0, config_1.getClientWebpack)(config);
    return await new Promise((resolve) => {
        const compiler = (0, webpack_1.default)(webpackConfig);
        const server = new WebpackDevServer(compiler, webpackDevServerConfig);
        compiler.hooks.done.tap('DonePlugin', () => {
            resolve();
        });
        server.listen(fePort, host);
    });
};
exports.startClientServer = startClientServer;
const startClientBuild = async (config) => {
    const { webpackStatsOption } = config;
    const webpackConfig = (0, config_1.getClientWebpack)(config);
    const stats = await (0, promisify_1.webpackPromisify)(webpackConfig);
    console.log(stats.toString(webpackStatsOption));
};
exports.startClientBuild = startClientBuild;
