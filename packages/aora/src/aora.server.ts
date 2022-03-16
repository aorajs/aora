import {getCwd, normalizePath} from "./utils";
import {readConfig} from "@aora/cli";
import {cloneDeep} from 'lodash'
import {resolve} from "path";
import {renderToString} from "react-dom/server";
import {ExpressContext, ISSRContext, UserConfig} from '@aora/types';

export class AoraServer {
  protected options: any;
  protected hasLoadConfig = false
  protected config: any = {}

  constructor(options: any) {
    this.options = options;
  }

  public async prepare() {
    console.log(11);
  }

  protected async loadConfig() {
    if (!this.hasLoadConfig) {
      this.config = await readConfig()
      this.hasLoadConfig = true
    }
    return this.config
  }

  public render(data: unknown, ctx: any, options?: any): Promise<string>;
  public render<T>(data: unknown, ctx: any, options?: any): Promise<T>;
  public async render(data: unknown, ctx: any, options?: any) {
    const defaultConfig = await this.loadConfig()
    const {chunkName} = defaultConfig;
    const cwd = getCwd();
    const config = Object.assign(cloneDeep(defaultConfig), options ?? {});
    const isDev = config.isDev || process.env.NODE_ENV !== 'production';
    console.log('isDev', isDev);
    const serverFile = resolve(cwd, `./.aora/server/${chunkName}.server.js`);
    if (isDev) {
      // clear cache in development environment
      delete require.cache[serverFile];
    }

    const {serverRender} = await import(serverFile);
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
    const serverRes = await serverRender(data, ctx, config, {base, path});

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
}
