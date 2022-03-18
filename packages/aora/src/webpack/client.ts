import { IConfig } from '@aora/types';
import * as webpack from 'webpack';
import { getClientWebpack } from '../entity/config';
import { webpackCompiler } from './utils/promisify';
import * as WebpackDevServer from 'webpack-dev-server'
import { getOutputPublicPath, normalizeStartPath } from '../utils';

const startClientServer = async (config: IConfig): Promise<void> => {
  const { isDev, fePort, host } = config;

  const webpackStatsOption = {
    assets: true, // 添加资源信息
    cachedAssets: false, // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
    children: false, // 添加 children 信息
    chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
    colors: true, // 以不同颜色区分构建信息
    modules: false, // 添加构建模块信息
    warnings: false,
    entrypoints: false,
  };

  const publicPath = config.publicPath?.startsWith('http')
    ? config.publicPath
    : normalizeStartPath(config.publicPath ?? '/');

  let devPublicPath = publicPath.startsWith('http')
    ? publicPath.replace(/^http(s)?:\/\/(.*)?\d/, '')
    : getOutputPublicPath(publicPath, isDev); // 本地开发不使用 http://localhost:3000 这样的 path 赋值给 webpack-dev-server 会很难处理

  const webpackDevServerConfig: WebpackDevServer.Configuration = {
    allowedHosts: 'all',
    devMiddleware: {
      stats: webpackStatsOption,
      publicPath: devPublicPath,
    },
    hot: 'only',
    host,
    port: fePort,
    https: false,
    client: {
      webSocketURL: {
        hostname: '0.0.0.0',
        pathname: '/ws',
        port: fePort,
      },
      logging: 'none',
    },
    headers: () => ({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':
        'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    }),
    // ...(config.webpackDevServerConfig || {}),
  };
  const webpackConfig = getClientWebpack(config);
  return await new Promise(async (resolve) => {
    const compiler = webpack(webpackConfig);

    const server = new WebpackDevServer(webpackDevServerConfig, compiler);
    compiler.hooks.done.tap('DonePlugin', () => {
      resolve();
    });

    await server.start()
    // server.listen(fePort, host, (err) => {
    //   if (err) {
    //     console.error(err)
    //   }
    // });
  });
};

const startClientBuild = async (config: IConfig) => {
  const webpackConfig = getClientWebpack(config);
  await webpackCompiler(webpackConfig);
};

export { startClientServer, startClientBuild };
