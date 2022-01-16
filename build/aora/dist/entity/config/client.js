"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientWebpack = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("../../utils");
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const base_1 = require("./base");
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
// const safePostCssParser = require('postcss-safe-parser')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const generateAnalysis = Boolean(process.env.GENERATE_ANALYSIS);
const loadModule = require.resolve;
let asyncChunkMap = {};
const getClientWebpack = (config) => {
    const { isDev, chunkName, getOutput, cwd, useHash, chainClientConfig } = config;
    const chain = new webpack_chain_1.default();
    const shouldUseSourceMap = isDev || Boolean(process.env.GENERATE_SOURCEMAP);
    const publicPath = (0, utils_1.getOutputPublicPath)(config.publicPath, isDev);
    (0, base_1.getBaseConfig)(chain, config, false);
    chain.devtool(isDev ? 'cheap-module-source-map' : (shouldUseSourceMap ? 'source-map' : false));
    chain.entry(chunkName)
        .add((0, path_1.join)(__dirname, '../entry/client-entry'))
        .end()
        .output
        .path(getOutput().clientOutPut)
        .filename(useHash ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js')
        .chunkFilename(useHash ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js')
        .publicPath(publicPath)
        .end();
    chain.optimization
        .runtimeChunk(true)
        .splitChunks({
        chunks: 'all',
        name(_module, chunks, _cacheGroupKey) {
            return (0, utils_1.cryptoAsyncChunkName)(chunks, asyncChunkMap);
        },
        cacheGroups: {
            vendors: {
                test: (module) => {
                    return module.resource &&
                        /\.js$/.test(module.resource) &&
                        module.resource.match('node_modules');
                },
                name: 'vendor'
            }
        }
    });
    // .when(!isDev, optimization => {
    //   optimization.minimizer('terser')
    //     .use(loadModule('terser-webpack-plugin'), [{
    //       terserOptions: {
    //         keep_fnames: true,
    //         parse: {
    //           ecma: 8
    //         },
    //         compress: {
    //           ecma: 5,
    //           warnings: false,
    //           comparisons: false,
    //           inline: 2
    //         },
    //         mangle: {
    //           safari10: true
    //         },
    //         output: {
    //           ecma: 5,
    //           comments: false,
    //           ascii_only: true
    //         }
    //       },
    //       extractComments: false,
    //       parallel: true,
    //       cache: true,
    //       sourceMap: shouldUseSourceMap
    //     }])
    //   optimization.minimizer('optimize-css').use(loadModule('optimize-css-assets-webpack-plugin'), [{
    //     cssProcessorOptions: {
    //       parser: safePostCssParser,
    //       map: shouldUseSourceMap ? {
    //         inline: false,
    //         annotation: true
    //       } : false
    //     }
    //   }])
    // })
    chain.plugin('moduleNotFound').use(ModuleNotFoundPlugin, [cwd]);
    chain.plugin('manifest').use(loadModule('webpack-manifest-plugin'), [{
            fileName: 'asset-manifest.json'
        }]);
    chain.when(generateAnalysis, chain => {
        chain.plugin('analyze').use(BundleAnalyzerPlugin);
    });
    chain.plugin('WriteAsyncManifest').use(class WriteAsyncChunkManifest {
        apply(compiler) {
            compiler.hooks.watchRun.tap('thisCompilation', async () => {
                // 每次构建前清空上一次的 chunk 信息
                asyncChunkMap = {};
            });
            compiler.hooks.done.tapAsync('WriteAsyncChunkManifest', async (_params, callback) => {
                await fs_1.promises.writeFile((0, path_1.resolve)((0, utils_1.getCwd)(), './.aora/asyncChunkMap.json'), JSON.stringify(asyncChunkMap));
                callback();
            });
        }
    });
    chainClientConfig(chain); // 合并用户自定义配置
    chain.optimization.get('splitChunks').chunks = 'initial';
    return chain.toConfig();
};
exports.getClientWebpack = getClientWebpack;
