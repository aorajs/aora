import { IConfig } from '@aora/types';

export const start = async (config: IConfig) => {
  // 本地开发的时候要做细致的依赖分离， Vite 场景不需要去加载 Webpack 构建客户端应用所需的模块
  const { startServerBuild, startClientServer } = await import('../webpack');
  await Promise.all([startServerBuild(config), startClientServer(config)]);
};

export const build = async (config: IConfig) => {
  const { startServerBuild, startClientBuild } = await import('../webpack');
  await Promise.all([startServerBuild(config), startClientBuild(config)]);
};
