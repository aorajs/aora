import { IConfig } from '@aora/types';
import * as webpack from 'webpack';
import { getClientWebpack } from '../entity/config';
import { webpackCompiler } from './utils/promisify';
import * as WebpackDevServer from 'webpack-dev-server'

const startClientServer = async (config: IConfig): Promise<void> => {
  const { webpackDevServerConfig, fePort, host } = config;
  const webpackConfig = getClientWebpack(config);
  return await new Promise((resolve) => {
    const compiler = webpack(webpackConfig);

    const server = new WebpackDevServer(webpackDevServerConfig, compiler);
    compiler.hooks.done.tap('DonePlugin', () => {
      resolve();
    });

    server.listen(fePort, host, (err) => {
      if (err) {
        console.error(err)
      }
    });
  });
};

const startClientBuild = async (config: IConfig) => {
  const webpackConfig = getClientWebpack(config);
  await webpackCompiler(webpackConfig);
};

export { startClientServer, startClientBuild };
