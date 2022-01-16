"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStyle = void 0;
const path_1 = require("path");
const cwd_1 = require("../cwd");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const genericNames = require('generic-names');
const cwd = (0, cwd_1.getCwd)();
const setStyle = (config, chain, reg, options) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const { css, isDev } = config;
    const { include, exclude, importLoaders, loader, isServer } = options;
    const loadModule = require.resolve;
    const userCssloaderOptions = (_b = (_a = css === null || css === void 0 ? void 0 : css().loaderOptions) === null || _a === void 0 ? void 0 : _a.cssOptions) !== null && _b !== void 0 ? _b : {};
    const defaultCssloaderOptions = {
        importLoaders: importLoaders,
        modules: {
            // 对 .module.xxx 的文件开启 css-modules
            auto: true,
            // 对齐vite 场景 css-loader 与 postcss-modules 生成 hash 方式
            getLocalIdent: (context, _localIdentName, localName, _options) => {
                return genericNames('[name]__[local]___[hash:base64:5]', {
                    context: process.cwd()
                })(localName, context.resourcePath);
            }
        },
        url: (url) => {
            // 绝对路径开头的静态资源地址不处理
            return !url.startsWith('/');
        }
    };
    const finalCssloaderOptions = Object.assign({}, defaultCssloaderOptions, userCssloaderOptions);
    const postCssPlugins = (_e = (_d = (_c = css === null || css === void 0 ? void 0 : css().loaderOptions) === null || _c === void 0 ? void 0 : _c.postcss) === null || _d === void 0 ? void 0 : _d.plugins) !== null && _e !== void 0 ? _e : []; // 用户自定义 postcss 插件
    const userPostcssOptions = (_g = (_f = css === null || css === void 0 ? void 0 : css().loaderOptions) === null || _f === void 0 ? void 0 : _f.postcss) === null || _g === void 0 ? void 0 : _g.options; // postCssOptions maybe function|object
    const postcssOptions = typeof userPostcssOptions === 'function' ? userPostcssOptions : Object.assign({
        ident: 'postcss',
        plugins: [
            require('postcss-flexbugs-fixes'),
            require('postcss-discard-comments'),
            require('postcss-preset-env')({
                autoprefixer: {
                    flexbox: 'no-2009'
                },
                stage: 3
            })
        ].concat(postCssPlugins)
    }, userPostcssOptions !== null && userPostcssOptions !== void 0 ? userPostcssOptions : {}); // 合并用户自定义 postcss options
    chain.module
        .rule(options.rule)
        .test(reg)
        .when(Boolean(include), (rule) => {
        include && rule.include.add(include).end();
    })
        .when(Boolean(exclude), (rule) => {
        exclude && rule.exclude.add(exclude).end();
    })
        .when(isDev, (rule) => {
        rule.use('hmr')
            .loader(loadModule('css-hot-loader'))
            .end();
    })
        .use('MiniCss')
        .loader(MiniCssExtractPlugin.loader)
        .options({
        // vite 场景下服务端 bundle 输出 css 文件，否则 服务端不输出
        emit: !isServer
    })
        .end()
        .use('css-loader')
        .loader(loadModule('css-loader'))
        .options(finalCssloaderOptions)
        .end()
        .use('postcss-loader')
        .loader(loadModule('postcss-loader'))
        .options({
        postcssOptions: postcssOptions
    })
        .end()
        .when(Boolean(loader), (rule) => {
        loader && rule.use(loader)
            .loader(loadModule(loader))
            .when(loader === 'less-loader', (rule) => {
            var _a, _b;
            const lessToJs = require("less-vars-to-js");
            const fs = require("fs");
            let modifyVars = {};
            const variablesFile = (0, path_1.join)(cwd, "./web/variables.less");
            if (fs.existsSync(variablesFile)) {
                modifyVars = (lessToJs.__esModule ? lessToJs.default : lessToJs)(fs.readFileSync((0, path_1.join)(cwd, "./web/variables.less"), "utf8"));
            }
            rule.options((_b = (_a = css === null || css === void 0 ? void 0 : css().loaderOptions) === null || _a === void 0 ? void 0 : _a.less) !== null && _b !== void 0 ? _b : {
                lessOptions: {
                    modifyVars,
                    javascriptEnabled: true
                }
            });
        })
            .when(loader === 'sass-loader', (rule) => {
            var _a, _b;
            rule.options((_b = (_a = css === null || css === void 0 ? void 0 : css().loaderOptions) === null || _a === void 0 ? void 0 : _a.sass) !== null && _b !== void 0 ? _b : {});
        })
            .end();
    });
};
exports.setStyle = setStyle;
