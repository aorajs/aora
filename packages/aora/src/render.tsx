import { resolve } from 'path';
import { renderToString } from 'react-dom/server';
import { loadConfig, getCwd } from './utils';
// @ts-ignore
import type { ISSRContext, UserConfig, ExpressContext } from 'aora/types';

const cwd = getCwd();
const defaultConfig = loadConfig();
const { chunkName } = defaultConfig;

export function render(ctx: ISSRContext, options?: UserConfig): Promise<string>
export function render<T>(ctx: ISSRContext, options?: UserConfig): Promise<T>
export async function render(ctx: ISSRContext, options?: UserConfig) {
  const config = Object.assign({}, defaultConfig, options ?? {});
  const { isDev } = config;
  console.log(options);
  const { request } = ctx;
  const url = new URL(request.url, `http://${request.headers.host}`);
  const isLocal = isDev || process.env.NODE_ENV !== 'production';
  const serverFile = resolve(cwd, `./.aora/server/${chunkName}.server.js`);
  if (isLocal) {
    // clear cache in development environment
    delete require.cache[serverFile];
  }
  const { AoraServer2: serverRender } = require(serverFile);
  // const serverRes = await serverRender({ context: ctx, base: '/', url });
  const serverRes = await serverRender({ context: ctx, base: '/', url });
  if (!(ctx as ExpressContext).response.hasHeader?.('content-type')) {
    // express 场景
    (ctx as ExpressContext).response.setHeader?.('Content-type', 'text/html;charset=utf-8');
  }
  try {
    const markup = renderToString(serverRes);
    return '<!DOCTYPE html>' + markup;
  } catch (e) {
    console.log(e);
  }
}


export default render;
