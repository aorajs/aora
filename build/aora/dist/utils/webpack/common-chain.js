"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addImageChain = void 0;
const parse_1 = require("../parse");
const loadModule = require.resolve;
const addImageChain = (config, chain, isServer) => {
    const { publicPath, imagePath } = (0, parse_1.getImageOutputPath)(config.publicPath, config.isDev);
    chain.module
        .rule('images')
        .test(/\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/)
        .use('url-loader')
        .loader(loadModule('url-loader'))
        .options({
        name: '[name].[hash:8].[ext]',
        // require 图片的时候不用加 .default
        esModule: false,
        limit: 4096,
        fallback: {
            loader: loadModule('file-loader'),
            options: {
                emitFile: !isServer,
                publicPath,
                name: '[name].[hash:8].[ext]',
                esModule: false,
                outputPath: imagePath
            }
        }
    })
        .end();
};
exports.addImageChain = addImageChain;
