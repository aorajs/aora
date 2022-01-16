"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const path_1 = require("path");
const cwd_1 = require("./cwd");
let cacheConfig = null;
const loadConfig = () => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (cacheConfig && !cacheConfig.isDev) {
        return {
            ...cacheConfig
        };
    }
    const userConfig = (0, cwd_1.getUserConfig)();
    const cwd = (0, cwd_1.getCwd)();
    const ssr = true;
    const stream = false;
    const publicPath = ((_a = userConfig.publicPath) === null || _a === void 0 ? void 0 : _a.startsWith('http')) ? userConfig.publicPath : (0, cwd_1.normalizeStartPath)((_b = userConfig.publicPath) !== null && _b !== void 0 ? _b : '/');
    const devPublicPath = publicPath.startsWith('http') ? publicPath.replace(/^http(s)?:\/\/(.*)?\d/, '') : publicPath; // 本地开发不使用 http://localhost:3000 这样的 path 赋值给 webpack-dev-server 会很难处理
    const moduleFileExtensions = [
        '.web.mjs',
        '.mjs',
        '.web.js',
        '.js',
        '.web.ts',
        '.ts',
        '.web.tsx',
        '.tsx',
        '.json',
        '.web.jsx',
        '.jsx',
        '.vue',
        '.css'
    ];
    const isDev = (_c = userConfig.isDev) !== null && _c !== void 0 ? _c : process.env.NODE_ENV !== 'production';
    const fePort = (_d = userConfig.fePort) !== null && _d !== void 0 ? _d : 8888;
    let https = userConfig.https ? userConfig.https : !!process.env.HTTPS;
    if (!((typeof https === 'boolean' && https) || (typeof https === 'object' && Object.keys(https).length !== 0))) {
        https = false;
    }
    const serverPort = (_e = process.env.SERVER_PORT) !== null && _e !== void 0 ? _e : 3000;
    const host = '0.0.0.0';
    const chunkName = 'aora';
    const clientLogLevel = 'error';
    const useHash = !isDev; // 生产环境默认生成hash
    const whiteList = [];
    const jsOrder = [`runtime~${chunkName}.js`, 'vendor.js', `${chunkName}.js`].concat((_f = userConfig.extraJsOrder) !== null && _f !== void 0 ? _f : []);
    const cssOrder = [`${chunkName}.css`].concat((_g = userConfig.extraCssOrder) !== null && _g !== void 0 ? _g : []);
    const webpackStatsOption = {
        assets: true,
        cachedAssets: false,
        children: false,
        chunks: false,
        colors: true,
        modules: false,
        warnings: false,
        entrypoints: false
    };
    const dynamic = !process.env.SPA; // SPA 部署模式下不开启 dynamic
    const corejs = false;
    const getOutput = () => ({
        clientOutPut: (0, path_1.join)(cwd, './public/_aora'),
        serverOutPut: (0, path_1.join)(cwd, './.aora/server')
    });
    const webpackDevServerConfig = Object.assign({
        stats: webpackStatsOption,
        disableInfo: true,
        disableHostCheck: true,
        publicPath: devPublicPath,
        hotOnly: true,
        host,
        sockPort: fePort,
        hot: true,
        port: fePort,
        https,
        clientLogLevel: clientLogLevel,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        }
    }, userConfig.webpackDevServerConfig);
    const chainBaseConfig = () => {
        // 覆盖默认webpack配置
    };
    const chainClientConfig = () => {
        // 覆盖默认 client webpack配置
    };
    const chainServerConfig = () => {
        // 覆盖默认 server webpack配置
    };
    const manifestPath = `${(0, cwd_1.normalizeEndPath)(devPublicPath)}asset-manifest.json`;
    const staticPath = `${(0, cwd_1.normalizeEndPath)(devPublicPath)}static`;
    const hotUpdatePath = `${(0, cwd_1.normalizeEndPath)(devPublicPath)}*.hot-update**`;
    const proxyKey = [staticPath, hotUpdatePath, manifestPath];
    const config = Object.assign({}, {
        chainBaseConfig,
        chainServerConfig,
        chainClientConfig,
        cwd,
        isDev,
        publicPath,
        useHash,
        host,
        moduleFileExtensions,
        fePort,
        serverPort,
        chunkName,
        jsOrder,
        cssOrder,
        getOutput,
        webpackStatsOption,
        whiteList,
        dynamic,
        ssr,
        stream,
        corejs,
        https,
        manifestPath,
        proxyKey
    }, userConfig);
    config.webpackDevServerConfig = webpackDevServerConfig; // 防止把整个 webpackDevServerConfig 全量覆盖了
    cacheConfig = config;
    return config;
};
exports.loadConfig = loadConfig;
