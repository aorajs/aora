import { IConfig } from '@aora/types';
import * as esbuild from 'esbuild';
import * as path from 'path';
import * as process from 'process';

export const start = async (config: IConfig) => {
  // 本地开发的时候要做细致的依赖分离， Vite 场景不需要去加载 Webpack 构建客户端应用所需的模块
  const { startServerBuild, startClientServer } = await import('../webpack');
  await Promise.all([startServerBuild(config), startClientServer(config)]);

};

export const build = async (config: IConfig) => {
  console.log(__dirname)
  // const serverCode = await esbuild.build({
  //   entryPoints: [path.resolve(__dirname, '../entry.server')],
  //   format: 'cjs',
  //   target: 'es2018',
  //   bundle: true,
  //   platform: 'neutral',
  //   outdir: path.resolve(process.cwd(), './.aora/server'),
  //   external: ['require', 'aora'],
  // })
  const { startServerBuild, startClientBuild } = await import('../webpack');
  await Promise.all([startServerBuild(config), startClientBuild(config)]);

  console.log(path.resolve(process.cwd(), './.aora/server2'))
};
