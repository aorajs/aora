import { IConfig } from '@aora/types';
import { getServerWebpack } from '../entity/config';
import { webpackCompiler } from './utils/promisify';

export const startServerBuild = async (config: IConfig) => {
  const webpackConfig = getServerWebpack(config);
  await webpackCompiler(webpackConfig);
  // console.log(stats.toString(webpackStatsOption));
};
