import { IConfig } from '@aora/types';
import { join } from 'path';
import * as webpack from 'webpack';
import * as WebpackChain from 'webpack-5-chain';
import {
  getLocalNodeModules,
  nodeExternals,
  uniqueWhitelist,
} from '../../utils';
import { getBaseConfig } from './base';

export const getServerWebpack = (config: IConfig) => {
  const { isDev, cwd, getOutput, chainServerConfig, whiteList, chunkName } =
    config;
  const chain = new WebpackChain();
  getBaseConfig(chain, config, true);
  chain.devtool(isDev ? 'inline-source-map' : false);
  chain.target('node');
  chain
    .entry(chunkName)
    .add(join(__dirname, '../../entry.server'))
    .end()
    .output.path(getOutput().serverOutPut)
    .filename('[name].server.js')
    .chunkFilename('js/[name].[contenthash:8].chunk.js')
    .libraryTarget('commonjs');

  const modulesDir = [join(cwd, './node_modules')];
  modulesDir.push(getLocalNodeModules());

  chain.externals(
    nodeExternals({
      whitelist: uniqueWhitelist(
        [
          /\.(css|less|sass|scss)$/,
          /react-vant.*?style/,
          /antd.*?(style)/,
          /store$/,
          /antd-mobile.*/,
          /@babel*/,
          ...(whiteList || [])
        ],
      ),
      // externals Dir contains example/xxx/node_modules ssr/node_modules
      modulesDir,
    }),
  );
//   externals?:
// | string
//   | RegExp
//   | ExternalItem[]
//   | (ExternalItemObjectKnown & ExternalItemObjectUnknown)
//   | ((
//     data: ExternalItemFunctionData,
//     callback: (
//       err?: Error,
//       result?: string | boolean | string[] | { [index: string]: any }
//     ) => void
//   ) => void)
//   | ((data: ExternalItemFunctionData) => Promise<ExternalItemValue>);

  chain.when(isDev, () => {
    chain.watch(true);
  });

  chain.plugin('serverLimit').use(webpack.optimize.LimitChunkCountPlugin, [
    {
      maxChunks: 1,
    },
  ]);

  chainServerConfig(chain); // 合并用户自定义配置

  return chain.toConfig();
};
