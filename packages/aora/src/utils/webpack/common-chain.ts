import { IConfig } from '@aora/types';
import * as WebpackChain from 'webpack-5-chain';
import { getImageOutputPath } from '../parse';

const loadModule = require.resolve;

const addImageChain = (
  config: IConfig,
  chain: WebpackChain,
  isServer: boolean,
) => {
  const { publicPath, imagePath } = getImageOutputPath(
    config.publicPath,
    config.isDev,
  );
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
          outputPath: imagePath,
        },
      },
    })
    .end();
};

export { addImageChain };
