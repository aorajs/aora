import type { IConfig } from '@aora/types';
import * as path from 'path';
import { join } from 'path';
import { getCwd, getOutputPublicPath, normalizeEndPath, normalizeStartPath } from './utils/cwd';

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
  const isDev = appConfig.isDev ?? process.env.NODE_ENV !== 'production';

  const publicPath = appConfig.publicPath?.startsWith('http')
    ? appConfig.publicPath
    : normalizeStartPath(appConfig.publicPath ?? '/');

  let devPublicPath = publicPath.startsWith('http')
    ? publicPath.replace(/^http(s)?:\/\/(.*)?\d/, '')
    : getOutputPublicPath(publicPath, isDev); // 本地开发不使用 http://localhost:3000 这样的 path 赋值给 webpack-dev-server 会很难处理

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
    // '.css',
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
  ];

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

  const host = '0.0.0.0';

  const chunkName = 'aora';

  // const clientLogLevel: ClientLogLevel = 'error';

  const useHash = !isDev; // 生产环境默认生成hash

  const whiteList: (RegExp | string)[] = [];

  const jsOrder = [
    `runtime~${chunkName}.js`,
    'vendor.js',
    `${chunkName}.js`,
  ].concat(appConfig.extraJsOrder ?? []);

  const cssOrder = [`${chunkName}.css`].concat(appConfig.extraCssOrder ?? []);

  const dynamic = !process.env.SPA; // SPA 部署模式下不开启 dynamic

  const corejs = false;
  const getOutput = () => ({
    clientOutPut: join(cwd, './public/build'),
    serverOutPut: join(cwd, './.aora/server'),
  });

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
      chunkName,
      jsOrder,
      cssOrder,
      getOutput,
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

  return config
}
