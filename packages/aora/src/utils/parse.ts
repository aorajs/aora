import { IConfig, ParseFeRouteItem } from '@aora/types';
import { lstatSync, promises as fsp, readdirSync, existsSync, mkdirSync } from 'fs';
import * as esbuild from 'esbuild'
import * as path from 'path';
import {
  accessFile,
  getCwd,
  getFeDir,
  getPagesDir,
  normalizeStartPath,
} from './cwd';
import { config } from 'rxjs';

const debug = require('debug')('ssr:parse');
const pageDir = getPagesDir();
const cwd = getCwd();

const getPrefix = (prefix: IConfig['prefix']) => {
  return prefix ? normalizeStartPath(prefix) : prefix;
};

export function createRouteId(file: string) {
  return normalizeSlashes(stripFileExtension(file));
}

export function normalizeSlashes(file: string) {
  return file.split(path.win32.sep).join('/');
}

function stripFileExtension(file: string) {
  return file.replace(/\.[a-z0-9]+$/i, '');
}

const routeModuleExts = ['.js', '.jsx', '.ts', '.tsx'];

export function isRouteModuleFile(filename: string): boolean {
  return routeModuleExts.includes(path.extname(filename));
}

function visitFiles(
  dir: string,
  visitor: (file: string) => void,
  baseDir = dir,
): void {
  for (let filename of readdirSync(dir)) {
    let file = path.resolve(dir, filename);
    let stat = lstatSync(file);

    if (stat.isDirectory()) {
      visitFiles(file, visitor, baseDir);
    } else if (stat.isFile()) {
      visitor(path.relative(baseDir, file));
    }
  }
}

export const normalizePath = (config: IConfig, path: string, base?: string) => {
  const prefix = getPrefix(config.prefix);
  // 移除 prefix 保证 path 跟路由表能够正确匹配
  const baseName = base ?? prefix;
  if (baseName) {
    path = path.replace(baseName, '');
  }
  if (path.startsWith('//')) {
    path = path.replace('//', '/');
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
};

export const normalizePublicPath = (path: string) => {
  // 兼容 /pre /pre/ 两种情况
  if (!path.endsWith('/')) {
    path = `${path}/`;
  }
  return path;
};

export const getOutputPublicPath = (publicPath: string, isDev: boolean) => {
  const path = normalizePublicPath(publicPath);
  console.log('isDev', isDev);
  return `${path}build/`;
};

export const getImageOutputPath = (publicPath: string, isDev: boolean) => {
  const imagePath = 'images';
  const normalizePath = normalizePublicPath(publicPath);
  return {
    publicPath: isDev
      ? `${normalizePath}${imagePath}`
      : `${normalizePath}build/${imagePath}`,
    imagePath,
  };
};

const parseFeRoutes = async (config: IConfig) => {
  const { dynamic, routerPriority, routerOptimize } = config;
  const prefix = getPrefix(config.prefix);

  let routes = '';
  // 根据目录结构生成前端路由表
  const pathRecord = ['']; // 路径记录
  // @ts-ignore
  const route: ParseFeRouteItem = {};
  let arr = getRoutes(config).map((r: any) => {
    const item = {
      component: `@/${r.file}`,
      path: path.join('/', r.path),
      webpackChunkName: r.id.slice('pages'.length + 1),
      id: r.id,
      index: r.index,
    }
    return item
  });
  debug('Before the result that parse web folder to routes is: ', arr);

  // React 场景
  const accessReactApp = await accessFile(
    path.join(getFeDir(), './layouts/App.tsx'),
  );
  const layoutFetch = await accessFile(
    path.join(getFeDir(), './layouts/fetch.ts'),
  );
  const accessStore = await accessFile(
    path.join(getFeDir(), './store/index.ts'),
  );
  const re = /"webpackChunkName":("(.+?)")/g;
  routes = `
    // The file is provisional，don't depend on it
      export const FeRoutes = ${JSON.stringify(arr, (_key, value) =>
        value === '' || value === undefined ? undefined : value,
      )}
      ${
        accessReactApp
          ? 'export { default as App, fetch as layoutFetch } from "@/layouts/App.tsx"'
          : ''
      }
      ${
        layoutFetch
          ? 'export { default as layoutFetch } from "@/layouts/fetch.ts"'
          : ''
      }
      ${accessStore ? 'export * from "@/store/index.ts"' : ''}
      ${prefix ? `export const PrefixRouterBase='${prefix}'` : ''}

      `;
  routes = routes.replace(/"component":("(.+?)")/g, (_global, _m1, m2) => {
    const currentWebpackChunkName = re.exec(routes)![2];
    if (dynamic) {
      return `"component": function dynamicComponent () {
          return import(/* webpackChunkName: "${currentWebpackChunkName}" */ '${m2.replace(
        /\^/g,
        '"',
      )}')
        }
        `;
    } else {
      return `"component": require('${m2.replace(/\^/g, '"')}').default`;
    }
  });
  re.lastIndex = 0;
  // routes = routes.replace(/"fetch":("(.+?)")/g, (_global, _m1, m2) => {
  //   const currentWebpackChunkName = re.exec(routes)![2]
  //   return `"fetch": () => import(/* webpackChunkName: "${currentWebpackChunkName}-fetch" */ '${m2.replace(/\^/g, '"')}')`
  // })
  debug('After the result that parse web folder to routes is: ', routes);
  await writeRoutes(routes);
};

type Route = { id: string; index?: boolean; path?: string; file: string };

export function getRoutes(_config: IConfig): Route[] {
  let files: { [routeId: string]: string } = {};

  visitFiles(path.join(getFeDir(), './pages'), (file) => {
    if (!file.includes('render') && isRouteModuleFile(file)) {
      const routeId = createRouteId(path.join('pages', file));
      files[routeId] = path.join('pages', file);
      return;
    }
  });

  let routeIds = Object.keys(files).sort(byLongestFirst);
  let uniqueRoutes: Record<string, Route> = Object.create(null);
  // let uniqueRoutes = new Map<string, string>();
  // let defineRoute = (
  //   path: string | undefined,
  //   file: string,
  //   optionsOrChildren: string,
  // ) => {

  //   let options: any;
  //   if (typeof optionsOrChildren === "function") {
  //     // route(path, file, children)
  //     options = {};
  //     // children = optionsOrChildren;
  //   } else {
  //     // route(path, file, options, children)
  //     // route(path, file, options)
  //     options = optionsOrChildren || {};
  //   }

  //   let route: any = {
  //     path: path ? path : undefined,
  //     index: options.index ? true : undefined,
  //     caseSensitive: options.caseSensitive ? true : undefined,
  //     id: createRouteId(file),
  //     // parentId:
  //     //   parentRoutes.length > 0
  //     //     ? parentRoutes[parentRoutes.length - 1].id
  //     //     : undefined,
  //     file
  //   };

  //   newRoutes[route.id] = route;
  //   // if (children) {
  //   //   parentRoutes.push(route);
  //   //   children();
  //   //   parentRoutes.pop();
  //   // }
  // };

  routeIds.forEach((routeId) => {
    const parentId = '';
    let routePath: string | undefined = createRoutePath(
      routeId.slice((parentId || 'pages').length + 1),
    );
    let fullPath = createRoutePath(routeId.slice('pages'.length + 1));
    let isIndexRoute = routeId.endsWith('/index');
    let uniqueRouteId = (fullPath || '') + (isIndexRoute ? '?index' : '');
    if (isIndexRoute) {
      let invalidChildRoutes = routeIds.filter(
        (id) => findParentRouteId(routeIds, id) === routeId,
      );

      if (invalidChildRoutes.length > 0) {
        throw new Error(
          `Child routes are not allowed in index routes. Please remove child routes of ${routeId}`,
        );
      }

      // defineRoute(routePath, files[routeId], {
      //   index: true
      // });

      let route: any = {
        path: routePath ? routePath : '',
        index: true,
        // caseSensitive: options.caseSensitive ? true : undefined,
        id: createRouteId(files[routeId]),
        // parentId:
        //   parentRoutes.length > 0
        //     ? parentRoutes[parentRoutes.length - 1].id
        //     : undefined,
        file: files[routeId],
      };

      uniqueRoutes[route.id] = route;
    } else {
      // defineRoute(routePath, files[routeId], () => {
      // defineNestedRoutes(defineRoute, routeId);
      // });
      let route: any = {
        path: routePath ? routePath : '',
        // caseSensitive: options.caseSensitive ? true : undefined,
        id: createRouteId(files[routeId]),
        // parentId:
        //   parentRoutes.length > 0
        //     ? parentRoutes[parentRoutes.length - 1].id
        //     : undefined,
        file: files[routeId],
      };
      uniqueRoutes[route.id] = route;
    }
  });
  return Object.values(uniqueRoutes);
}

export function formatRoutes(config: IConfig, type: 'json' | 'jsx' = 'jsx') {
  const routes = getRoutes(config);

  if (type === 'json') {
    return JSON.stringify(routes || null, null, 2);
  } else {
    return formatRoutesAsJsx(routes);
  }
}

export function formatRoutesAsJsx(routes: any) {
  let output = '<Routes>';

  function handleRoutesRecursive(level = 1): boolean {
    let indent = Array(level * 2)
      .fill(' ')
      .join('');

    for (let route of routes) {
      output += '\n' + indent;
      output += `<Route${
        route.path ? ` path=${JSON.stringify(route.path)}` : ''
      }${route.index ? ' index' : ''}${
        route.file ? ` file=${JSON.stringify(route.file)}` : ''
      }>`;
      output = output.slice(0, -1) + ' />';
    }

    return routes.length > 0;
  }

  handleRoutesRecursive();
  output += '\n</Routes>';
  return output;
}

export const parseFeRoutes2 = async (config: IConfig) => {
  let files: { [routeId: string]: string } = {};
  const pagesDir = 'pages';

  visitFiles(path.join(getFeDir(), pagesDir), (file) => {
    if (!file.includes('render') && isRouteModuleFile(file)) {
      const routeId = createRouteId(path.join(pagesDir, file));
      files[routeId] = path.join(pagesDir, file);
      return;
    }
  });

  let routeIds = Object.keys(files).sort(byLongestFirst);
  let uniqueRoutes: any = Object.create(null);

  routeIds.forEach((routeId) => {
    let routePath: string | undefined = createRoutePath(
      routeId.slice(pageDir.length + 1),
    );
    let fullPath = createRoutePath(routeId.slice(pageDir.length + 1));
    let isIndexRoute = routeId.endsWith('/index');
    let uniqueRouteId = (fullPath || '') + (isIndexRoute ? '?index' : '');
    if (isIndexRoute) {
      let invalidChildRoutes = routeIds.filter(
        (id) => findParentRouteId(routeIds, id) === routeId,
      );

      if (invalidChildRoutes.length > 0) {
        throw new Error(
          `Child routes are not allowed in index routes. Please remove child routes of ${routeId}`,
        );
      }

      // defineRoute(routePath, files[routeId], {
      //   index: true
      // });

      let route: any = {
        path: routePath ? routePath : '',
        index: true,
        // caseSensitive: options.caseSensitive ? true : undefined,
        id: createRouteId(files[routeId]),
        // parentId:
        //   parentRoutes.length > 0
        //     ? parentRoutes[parentRoutes.length - 1].id
        //     : undefined,
        file: files[routeId],
      };

      uniqueRoutes[route.id] = route;
    } else {
      // defineRoute(routePath, files[routeId], () => {
      // defineNestedRoutes(defineRoute, routeId);
      // });
      let route: any = {
        path: routePath ? routePath : '',
        // caseSensitive: options.caseSensitive ? true : undefined,
        id: createRouteId(files[routeId]),
        // parentId:
        //   parentRoutes.length > 0
        //     ? parentRoutes[parentRoutes.length - 1].id
        //     : undefined,
        file: files[routeId],
      };
      uniqueRoutes[route.id] = route;
    }
  });
  console.log(uniqueRoutes);
  await fsp.writeFile(
    path.resolve(cwd, './.aora/routes-manifest.json'),
    JSON.stringify(uniqueRoutes),
  );

  const { dynamic, routerPriority, routerOptimize } = config;
  const prefix = getPrefix(config.prefix);

  let routes = '';
  const arr = Object.values(uniqueRoutes).map((r: any) => {
    const item = {
      component: `@/${r.file}`,
      path: path.join('/', r.path),
      webpackChunkName: r.id,
    }
    return item
  });
  debug('Before the result that parse web folder to routes is: ', arr);

  // React 场景
  const accessReactApp = await accessFile(
    path.join(getFeDir(), './layouts/App.tsx'),
  );
  const layoutFetch = await accessFile(
    path.join(getFeDir(), './layouts/fetch.ts'),
  );
  const accessStore = await accessFile(
    path.join(getFeDir(), './store/index.ts'),
  );
  const re = /"webpackChunkName":("(.+?)")/g;
  routes = `\n
// The file is provisional，don't depend on it \n
export const FeRoutes = ${JSON.stringify(arr)} \n
${
  accessReactApp
    ? 'export { default as App, fetch as layoutFetch } from "@/layouts/App.tsx"'
    : ''
} \n
${
  layoutFetch
    ? 'export { default as layoutFetch } from "@/layouts/fetch.ts"'
    : ''
} \n
${accessStore ? 'export * from "@/store/index.ts"' : ''} \n
${prefix ? `export const PrefixRouterBase='${prefix}'` : ''} \n
`;
  routes = routes.replace(/"component":("(.+?)")/g, (_global, _m1, m2) => {
    const currentWebpackChunkName = re.exec(routes)![2];
    if (dynamic) {
      return `"component": function dynamicComponent () {\n
    return import(/* webpackChunkName: "${currentWebpackChunkName}" */ '${m2.replace(
        /\^/g,
        '"',
      )}')\n
}`;
    } else {
      return `"component": require('${m2.replace(/\^/g, '"')}').default`;
    }
  });
  re.lastIndex = 0;
  debug('After the result that parse web folder to routes is: ', routes);
  const routesCode = await esbuild.transform(routes, {
    format: "esm",
  })
  await fsp.writeFile(path.resolve(cwd, './.aora/routes2.js'), routesCode.code);
  await fsp.writeFile(path.resolve(cwd, './.aora/routes.js'), routes);
};

function byLongestFirst(a: string, b: string): number {
  return b.length - a.length;
}

export function checkOutputDir() {
  const dir = path.resolve(cwd, './.aora');
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}

const writeRoutes = async (routes: string) => {
  checkOutputDir();
  const routesCode = await esbuild.transform(routes, {
    format: "esm",
    target: 'es6',
    keepNames: true,
    minifySyntax: true,
    // minify: true,
  })
  await fsp.writeFile(path.resolve(cwd, './.aora/routes.js'), routesCode.code);
  // await fsp.writeFile(path.resolve(cwd, './.aora/routes.js'), routes);
};

function findParentRouteId(
  routeIds: string[],
  childRouteId: string,
): string | undefined {
  return routeIds.find((id) => childRouteId.startsWith(`${id}/`));
}

const renderRoutes = async (
  pageDir: string,
  pathRecord: string[],
  route: ParseFeRouteItem,
): Promise<ParseFeRouteItem[]> => {
  let arr: ParseFeRouteItem[] = [];
  const pagesFolders = await fsp.readdir(pageDir);
  const prefixPath = pathRecord.join('/');
  const aliasPath = `@/pages${prefixPath}`;
  const routeArr: ParseFeRouteItem[] = [];
  const fetchExactMatch = pagesFolders.filter((p) => p.includes('fetch'));
  for (const pageFiles of pagesFolders) {
    const abFolder = path.join(pageDir, pageFiles);
    const isDirectory = (await fsp.stat(abFolder)).isDirectory();
    if (isDirectory) {
      // 如果是文件夹则递归下去, 记录路径
      pathRecord.push(pageFiles);
      const childArr = await renderRoutes(
        abFolder,
        pathRecord,
        Object.assign({}, route),
      );
      pathRecord.pop(); // 回溯
      arr = arr.concat(childArr);
    } else {
      // 遍历一个文件夹下面的所有文件
      if (!pageFiles.includes('render')) {
        continue;
      }
      // 拿到具体的文件
      if (pageFiles.includes('render$')) {
        /* /news/:id */
        route.path = `${prefixPath}/:${getDynamicParam(pageFiles)}`;
        route.component = `${aliasPath}/${pageFiles}`;
        let webpackChunkName = pathRecord.join('-');
        if (webpackChunkName.startsWith('-')) {
          webpackChunkName = webpackChunkName.replace('-', '');
        }
        route.webpackChunkName = `${webpackChunkName}-${getDynamicParam(
          pageFiles,
        )
          .replace(/\/:\??/g, '-')
          .replace('?', '-optional')}`;
      } else if (pageFiles.includes('render')) {
        /* /news */
        route.path = `${prefixPath}`;
        route.component = `${aliasPath}/${pageFiles}`;
        let webpackChunkName = pathRecord.join('-');
        if (webpackChunkName.startsWith('-')) {
          webpackChunkName = webpackChunkName.replace('-', '');
        }
        route.webpackChunkName = webpackChunkName;
      }

      if (fetchExactMatch.length >= 2) {
        // fetch文件数量 >=2 启用完全匹配策略 render$id => fetch$id, render => fetch
        const fetchPageFiles = `${
          pageFiles.replace('render', 'fetch').split('.')[0]
        }.ts`;
        if (fetchExactMatch.includes(fetchPageFiles)) {
          route.fetch = `${aliasPath}/${fetchPageFiles}`;
        }
      } else if (fetchExactMatch.includes('fetch.ts')) {
        // 单 fetch 文件的情况 所有类型的 render 都对应该 fetch
        route.fetch = `${aliasPath}/fetch.ts`;
      }
      routeArr.push({ ...route });
    }
  }
  routeArr.forEach((r) => {
    if (r.path?.includes('index')) {
      // /index 映射为 /
      if (r.path.split('/').length >= 3) {
        r.path = r.path.replace('/index', '');
      } else {
        r.path = r.path.replace('index', '');
      }
    }

    r.path && arr.push(r);
  });

  return arr;
};

const getDynamicParam = (url: string) => {
  return url
    .split('$')
    .filter((r) => r !== 'render' && r !== '')
    .map((r) => r.replace(/\.[\s\S]+/, '').replace('#', '?'))
    .join('/:');
};

export { parseFeRoutes };

let escapeStart = '[';
let escapeEnd = ']';

// TODO: Cleanup and write some tests for this function
export function createRoutePath(partialRouteId: string): string | undefined {
  let result = '';
  let rawSegmentBuffer = '';

  let inEscapeSequence = 0;
  let skipSegment = false;
  for (let i = 0; i < partialRouteId.length; i++) {
    let char = partialRouteId.charAt(i);
    let lastChar = i > 0 ? partialRouteId.charAt(i - 1) : undefined;
    let nextChar =
      i < partialRouteId.length - 1 ? partialRouteId.charAt(i + 1) : undefined;

    const isNewEscapeSequence = () => {
      return (
        !inEscapeSequence && char === escapeStart && lastChar !== escapeStart
      );
    };

    const isCloseEscapeSequence = () => {
      return inEscapeSequence && char === escapeEnd && nextChar !== escapeEnd;
    };

    const isStartOfLayoutSegment = () =>
      char === '_' && nextChar === '_' && !rawSegmentBuffer;

    if (skipSegment) {
      if (char === '/' || char === '.' || char === path.win32.sep) {
        skipSegment = false;
      }
      continue;
    }

    if (isNewEscapeSequence()) {
      inEscapeSequence++;
      continue;
    }

    if (isCloseEscapeSequence()) {
      inEscapeSequence--;
      continue;
    }

    if (inEscapeSequence) {
      result += char;
      continue;
    }

    if (char === '/' || char === path.win32.sep || char === '.') {
      if (rawSegmentBuffer === 'index' && result.endsWith('index')) {
        result = result.replace(/\/?index$/, '');
      } else {
        result += '/';
      }
      rawSegmentBuffer = '';
      continue;
    }

    if (isStartOfLayoutSegment()) {
      skipSegment = true;
      continue;
    }

    rawSegmentBuffer += char;

    if (char === '$') {
      result += typeof nextChar === 'undefined' ? '*' : ':';
      continue;
    }

    result += char;
  }

  if (rawSegmentBuffer === 'index' && result.endsWith('index')) {
    result = result.replace(/\/?index$/, '');
  }

  return result || undefined;
}
