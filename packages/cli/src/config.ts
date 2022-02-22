import type { IConfig } from '@aora/types';
import * as path from 'path';
import { join } from 'path';
import { getCwd, normalizeEndPath, normalizeStartPath } from './utils/cwd';

export type AppConfig = Partial<IConfig>;

export function readConfig(aoraRoot?: string): IConfig {
  if (!aoraRoot) {
    aoraRoot = process.env.AORA_ROOT || process.cwd();
  }

  let rootDirectory = path.resolve(aoraRoot);
  let configFile = path.resolve(rootDirectory, 'aora.config.js');

  let appConfig: AppConfig;
  try {
    appConfig = require(configFile);
  } catch (error) {
    throw new Error(`Error loading Aora config in ${configFile}`);
  }
  const cwd = getCwd();
  const ssr = true;
  const stream = false;
  type ClientLogLevel = 'error';

  const publicPath = appConfig.publicPath?.startsWith('http')
    ? appConfig.publicPath
    : normalizeStartPath(appConfig.publicPath ?? '/');
  const devPublicPath = publicPath.startsWith('http')
    ? publicPath.replace(/^http(s)?:\/\/(.*)?\d/, '')
    : publicPath; // 本地开发不使用 http://localhost:3000 这样的 path 赋值给 webpack-dev-server 会很难处理

  const moduleFileExtensions = [
    '.web.mjs',
    '.mjs',
    '.web.js',
    '.js',
    '.web.ts',
    '.ts',
    '.web.tsx',
    '.tsx',
    '.json',
    '.web.jsx',
    '.jsx',
    '.css',
  ];

  const isDev = appConfig.isDev ?? process.env.NODE_ENV !== 'production';

  const fePort = appConfig.fePort ?? 3010;

  let https = appConfig.https ? appConfig.https : !!process.env.HTTPS;

  if (
    !(
      (typeof https === 'boolean' && https) ||
      (typeof https === 'object' && Object.keys(https).length !== 0)
    )
  ) {
    https = false;
  }

  const serverPort = process.env.SERVER_PORT ?? 3000;

  const host = '0.0.0.0';

  const chunkName = 'aora';

  const clientLogLevel: ClientLogLevel = 'error';

  const useHash = !isDev; // 生产环境默认生成hash

  const whiteList: (RegExp | string)[] = [];

  const jsOrder = [
    `runtime~${chunkName}.js`,
    'vendor.js',
    `${chunkName}.js`,
  ].concat(appConfig.extraJsOrder ?? []);

  const cssOrder = [`${chunkName}.css`].concat(appConfig.extraCssOrder ?? []);

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

  const dynamic = !process.env.SPA; // SPA 部署模式下不开启 dynamic

  const corejs = false;
  const getOutput = () => ({
    clientOutPut: join(cwd, './public/build'),
    serverOutPut: join(cwd, './.aora/server'),
  });

  const webpackDevServerConfig = Object.assign(
    {
      stats: webpackStatsOption,
      disableInfo: true, // 关闭webpack-dev-server 自带的server Info信息
      disableHostCheck: true,
      publicPath: devPublicPath,
      hotOnly: true,
      host,
      sockPort: fePort,
      hot: true,
      port: fePort,
      https,
      clientLogLevel: clientLogLevel,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      },
    },
    appConfig.webpackDevServerConfig,
  );

  const chainBaseConfig = () => {
    // 覆盖默认webpack配置
  };
  const chainClientConfig = () => {
    // 覆盖默认 client webpack配置
  };
  const chainServerConfig = () => {
    // 覆盖默认 server webpack配置
  };

  const manifestPath = `${normalizeEndPath(devPublicPath)}asset-manifest.json`;
  const staticPath = `${normalizeEndPath(devPublicPath)}static`;
  const hotUpdatePath = `${normalizeEndPath(devPublicPath)}*.hot-update**`;

  const proxyKey = [staticPath, hotUpdatePath, manifestPath];

  const config = Object.assign(
    {},
    {
      chainBaseConfig,
      chainServerConfig,
      chainClientConfig,
      cwd,
      isDev,
      publicPath,
      useHash,
      host,
      moduleFileExtensions,
      fePort,
      serverPort,
      chunkName,
      jsOrder,
      cssOrder,
      getOutput,
      webpackStatsOption,
      whiteList,
      dynamic,
      ssr,
      stream,
      corejs,
      https,
      manifestPath,
      proxyKey,
    },
    appConfig,
  );

  config.webpackDevServerConfig = webpackDevServerConfig; // 防止把整个 webpackDevServerConfig 全量覆盖了
  return config;
}
