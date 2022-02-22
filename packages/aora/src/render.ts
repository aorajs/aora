import { readConfig } from '@aora/cli';
import { ExpressContext, ISSRContext, UserConfig } from '@aora/types';
import { resolve } from 'path';
import { renderToString } from 'react-dom/server';
import { getCwd, normalizePath } from './utils';

const cwd = getCwd();
const defaultConfig = readConfig();
const { chunkName } = defaultConfig;

export function render(
  data: unknown,
  ctx: ISSRContext,
  options?: UserConfig,
): Promise<string>;
export function render<T>(
  data: unknown,
  ctx: ISSRContext,
  options?: UserConfig,
): Promise<T>;
export async function render(
  data: unknown,
  ctx: ISSRContext,
  options?: UserConfig,
) {
  const config = Object.assign({}, defaultConfig, options ?? {});
  const { stream } = config;
  const isDev = config.isDev || process.env.NODE_ENV !== 'production';
  console.log('isDev', isDev);
  const serverFile = resolve(cwd, `./.aora/server/${chunkName}.server.js`);
  if (isDev) {
    // clear cache in development environment
    delete require.cache[serverFile];
  }

  const { serverRender } = await import(serverFile);
  const {
    cssOrder,
    jsOrder,
    dynamic,
    ssr = true,
    parallelFetch,
    prefix,
  } = config;
  const base = prefix ?? '/'; // 以开发者实际传入的为最高优先级
  let path = ctx.request.path; // 这里取 pathname 不能够包含 queryString
  // const base = prefix ?? PrefixRouterBase; // 以开发者实际传入的为最高优先级
  if (base) {
    path = normalizePath(config, path, base);
  }
  // const route = findRoute(FeRoutes, path);
  // if (!route) {
  //   throw new Error(
  //     `查找组件失败，请确认当前 path: ${path} 对应前端组件是否存在\n若创建了新的页面文件夹，请重新执行 npm start 重启服务`,
  //   );
  // }
  const serverRes = await serverRender(data, ctx, config, { base, path });

  if (!(ctx as ExpressContext).response.hasHeader?.('content-type')) {
    // express 场景
    (ctx as ExpressContext).response.setHeader?.(
      'Content-type',
      'text/html;charset=utf-8',
    );
  }

  const markup = renderToString(serverRes);
  return '<!DOCTYPE html>' + markup;
}

export default render;
