import { IConfig, Mode } from '@aora/types';
import { join } from 'path';
import * as webpack from 'webpack';
import * as WebpackChain from 'webpack-5-chain';
import { addImageChain, getCwd, getFeDir, getLocalNodeModules, setStyle } from '../../utils';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const loadModule = require.resolve;

const addBabelLoader = (
  chain: WebpackChain.Rule<WebpackChain.Module>,
  envOptions: any,
) => {
  chain
    .use('babel-loader')
    .loader(loadModule('babel-loader'))
    .options({
      cacheDirectory: true,
      cacheCompression: false,
      sourceType: 'unambiguous',
      presets: [
        [loadModule('@babel/preset-env'), envOptions],
        [
          loadModule('babel-preset-react-app'),
          { flow: false, typescript: true },
        ],
      ],
      plugins: [
        [
          loadModule('@babel/plugin-transform-runtime'),
          {
            regenerator: false,
            corejs: false,
            helpers: true,
          },
        ],
        [
          loadModule('babel-plugin-import'),
          {
            libraryName: 'antd',
            libraryDirectory: 'lib',
            style: true,
          },
          'antd',
        ],
        [
          loadModule('babel-plugin-import'),
          {
            libraryName: 'react-vant',
            libraryDirectory: 'lib',
            style: true,
          },
          'react-vant',
        ],
        [
          loadModule('babel-plugin-import'),
          {
            libraryName: 'antd-mobile',
            libraryDirectory: 'cjs/components',
            style: false,
          },
          'antd-mobile',
        ],
        [loadModule('@babel/plugin-proposal-private-methods'), { loose: true }],
        [
          loadModule('@babel/plugin-proposal-private-property-in-object'),
          { loose: true },
        ],
      ],
    })
    .end();
};

export const getBaseConfig = (
  chain: WebpackChain,
  config: IConfig,
  isServer: boolean,
) => {
  const {
    moduleFileExtensions,
    useHash,
    isDev,
    chainBaseConfig,
    corejs,
    babelExtraModule,
  } = config;
  const mode = process.env.NODE_ENV as Mode;
  const envOptions = {
    modules: false,
  };

  if (corejs) {
    Object.assign(envOptions, {
      corejs: {
        version: 3,
        proposals: true,
      },
      useBuiltIns: 'usage',
    });
  }
  chain.mode(mode);
  chain.stats('minimal')
  chain.module.strictExportPresence(true);
  chain.resolve.modules
    .add('node_modules')
    .add(join(getCwd(), './node_modules'))
    .when(isDev, (chain) => {
      chain.add(getLocalNodeModules());
    })
    .end()
    .extensions.merge(moduleFileExtensions)
    .end()
    .fallback.set('url', false)
    .end()
    .alias.end();
  chain.resolve.alias
    .set('@', getFeDir())
    .set('_build', join(getCwd(), './.aora'))
    .set('react', loadModule('react')) // 用cwd的路径alias，否则可能会出现多个react实例
    .set('react-router', loadModule('react-router'))
    .set('react-router-dom', loadModule('react-router-dom'));

  addImageChain(config, chain, isServer);

  const babelModule = chain.module
    .rule('compileBabel')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .exclude.add(/node_modules|core-js/)
    .end();

  const module = chain.module
    .rule('compileBabelForExtraModule')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include.add([]);

  let babelForExtraModule;
  if (babelExtraModule) {
    babelForExtraModule = module.add(babelExtraModule).end();
  } else {
    babelForExtraModule = module.end();
  }

  addBabelLoader(babelModule, envOptions);
  addBabelLoader(babelForExtraModule, envOptions);

  setStyle(config, chain, /\.css$/, {
    rule: 'css',
    isServer,
    importLoaders: 1,
  });

  setStyle(config, chain, /\.less$/, {
    rule: 'less',
    loader: 'less-loader',
    isServer,
    importLoaders: 2,
  });

  chain.module
    .rule('fonts')
    .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
    .use('file-loader')
    .loader(loadModule('file-loader'))
    .options({
      name: '[name].[hash:8].[ext]',
      esModule: false,
      emitFile: !isServer,
    });

  chain.plugin('minify-css').use(MiniCssExtractPlugin, [
    {
      filename: useHash
        ? 'css/[name].[contenthash:8].css'
        : 'css/[name].css',
      chunkFilename: useHash
        ? 'css/[name].[contenthash:8].css'
        : 'css/[name].chunk.css',
    },
  ]);

  chain.plugin('webpackBar').use(
    new WebpackBar({
      name: isServer ? 'server' : 'client',
      color: isServer ? '#f173ac' : '#45b97c',
    }),
  );
  chain.plugin('aoraDefine').use(webpack.DefinePlugin, [
    {
      __isBrowser__: !isServer,
    },
  ]);
  chainBaseConfig(chain);
  return config;
};
