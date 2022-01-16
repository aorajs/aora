"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseConfig = void 0;
const path_1 = require("path");
const utils_1 = require("../../utils");
const webpack_1 = __importDefault(require("webpack"));
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const loadModule = require.resolve;
const addBabelLoader = (chain, envOptions) => {
    chain.use('babel-loader')
        .loader(loadModule('babel-loader'))
        .options({
        cacheDirectory: true,
        cacheCompression: false,
        sourceType: 'unambiguous',
        presets: [
            [
                loadModule('@babel/preset-env'),
                envOptions
            ],
            [loadModule('babel-preset-react-app'), { flow: false, typescript: true }]
        ],
        plugins: [
            [loadModule('@babel/plugin-transform-runtime'), {
                    regenerator: false,
                    corejs: false,
                    helpers: true
                }],
            [
                loadModule('babel-plugin-import'),
                {
                    libraryName: 'antd',
                    libraryDirectory: 'lib',
                    style: true
                }, 'antd'
            ], [
                loadModule('babel-plugin-import'),
                {
                    libraryName: 'react-vant',
                    libraryDirectory: 'lib',
                    style: true
                }, 'react-vant'
            ], [
                loadModule('babel-plugin-import'),
                {
                    libraryName: "antd-mobile",
                    libraryDirectory: "cjs/components",
                    style: false,
                }, 'antd-mobile'
            ],
            [loadModule('@babel/plugin-proposal-private-methods'), { loose: true }],
            [loadModule('@babel/plugin-proposal-private-property-in-object'), { loose: true }]
        ]
    })
        .end();
};
const getBaseConfig = (chain, config, isServer) => {
    const { moduleFileExtensions, useHash, isDev, chainBaseConfig, corejs, babelExtraModule } = config;
    const mode = process.env.NODE_ENV;
    const envOptions = {
        modules: false
    };
    if (corejs) {
        Object.assign(envOptions, {
            corejs: {
                version: 3,
                proposals: true
            },
            useBuiltIns: 'usage'
        });
    }
    chain.mode(mode);
    chain.module.strictExportPresence(true);
    chain
        .resolve
        .modules
        .add('node_modules')
        .add((0, path_1.join)((0, utils_1.getCwd)(), './node_modules'))
        .when(isDev, chain => {
        chain.add((0, utils_1.getLocalNodeModules)());
    })
        .end()
        .extensions.merge(moduleFileExtensions)
        .end()
        .alias
        .end();
    chain.resolve.alias
        .set('@', (0, utils_1.getFeDir)())
        .set('_aora', (0, utils_1.getFeDir)())
        .set('_build', (0, path_1.join)((0, utils_1.getCwd)(), './.aora'))
        .set('react', loadModule('react')) // 用cwd的路径alias，否则可能会出现多个react实例
        .set('react-router', loadModule('react-router'))
        .set('react-router-dom', loadModule('react-router-dom'));
    (0, utils_1.addImageChain)(config, chain, isServer);
    const babelModule = chain.module
        .rule('compileBabel')
        .test(/\.(js|mjs|jsx|ts|tsx)$/)
        .exclude
        .add(/node_modules|core-js/)
        .end();
    const module = chain.module
        .rule('compileBabelForExtraModule')
        .test(/\.(js|mjs|jsx|ts|tsx)$/)
        .include
        .add([]);
    let babelForExtraModule;
    if (babelExtraModule) {
        babelForExtraModule = module.add(babelExtraModule).end();
    }
    else {
        babelForExtraModule = module.end();
    }
    addBabelLoader(babelModule, envOptions);
    addBabelLoader(babelForExtraModule, envOptions);
    (0, utils_1.setStyle)(config, chain, /\.css$/, {
        rule: 'css',
        isServer,
        importLoaders: 1
    });
    (0, utils_1.setStyle)(config, chain, /\.less$/, {
        rule: 'less',
        loader: 'less-loader',
        isServer,
        importLoaders: 2
    });
    chain.module
        .rule('fonts')
        .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
        .use('file-loader')
        .loader(loadModule('file-loader'))
        .options({
        name: 'static/[name].[hash:8].[ext]',
        esModule: false,
        emitFile: !isServer
    });
    chain.plugin('minify-css').use(MiniCssExtractPlugin, [{
            filename: useHash ? 'static/css/[name].[contenthash:8].css' : 'static/css/[name].css',
            chunkFilename: useHash ? 'static/css/[name].[contenthash:8].chunk.css' : 'static/css/[name].chunk.css'
        }]);
    chain.plugin('webpackBar').use(new WebpackBar({
        name: isServer ? 'server' : 'client',
        color: isServer ? '#f173ac' : '#45b97c'
    }));
    chain.plugin('ssrDefine').use(webpack_1.default.DefinePlugin, [{
            __isBrowser__: !isServer
        }]);
    chainBaseConfig(chain);
    return config;
};
exports.getBaseConfig = getBaseConfig;
