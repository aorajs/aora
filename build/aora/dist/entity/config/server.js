"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerWebpack = void 0;
const path_1 = require("path");
const utils_1 = require("../../utils");
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const webpack_1 = __importDefault(require("webpack"));
const base_1 = require("./base");
const getServerWebpack = (config) => {
    const { isDev, cwd, getOutput, chainServerConfig, whiteList, chunkName } = config;
    const chain = new webpack_chain_1.default();
    (0, base_1.getBaseConfig)(chain, config, true);
    chain.devtool(isDev ? 'inline-source-map' : false);
    chain.target('node');
    chain.entry(chunkName)
        .add((0, path_1.join)(__dirname, '../../entry.server'))
        .end()
        .output
        .path(getOutput().serverOutPut)
        .filename('[name].server.js')
        .libraryTarget('commonjs');
    const modulesDir = [(0, path_1.join)(cwd, './node_modules')];
    modulesDir.push((0, utils_1.getLocalNodeModules)());
    chain.externals((0, utils_1.nodeExternals)({
        whitelist: (0, utils_1.uniqueWhitelist)([/\.(css|less|sass|scss)$/, /react-vant.*?style/, /antd.*?(style)/, /store$/, /antd-mobile.*/, /@babel*/].concat(whiteList || [])),
        // externals Dir contains example/xxx/node_modules ssr/node_modules
        modulesDir
    }));
    chain.when(isDev, () => {
        chain.watch(true);
    });
    chain.plugin('serverLimit').use(webpack_1.default.optimize.LimitChunkCountPlugin, [{
            maxChunks: 1
        }]);
    chainServerConfig(chain); // 合并用户自定义配置
    return chain.toConfig();
};
exports.getServerWebpack = getServerWebpack;
