import { IConfig } from '@aora/types';
import * as webpack from 'webpack';
import { getClientWebpack } from '../entity/config';
import { webpackCompiler } from './utils/promisify';

// fork 后移除 webpack-dev-server 默认的启动 log，只展示服务端 Node.js 的启动监听端口
const WebpackDevServer = require('webpack-dev-server');

const startClientServer = async (config: IConfig): Promise<void> => {
  const { webpackDevServerConfig, fePort, host } = config;
  const webpackConfig = getClientWebpack(config);
  return await new Promise((resolve) => {
    const compiler = webpack(webpackConfig);

    const server = new WebpackDevServer(webpackDevServerConfig, compiler);
    compiler.hooks.done.tap('DonePlugin', () => {
      resolve();
    });

    server.listen(fePort, host);
  });
};

const startClientBuild = async (config: IConfig) => {
  const webpackConfig = getClientWebpack(config);
  await webpackCompiler(webpackConfig);
};

export { startClientServer, startClientBuild };
