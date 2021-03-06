import { getLayout, STORE_CONTEXT as Context } from '@aora/react';
import { IConfig, ISSRContext, ReactESMFeRouteItem, ReactRoutesType } from '@aora/types';
// @ts-ignore
import { addAsyncChunk, findRoute, getManifest, normalizePath } from 'aora';
import * as React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import * as serialize from 'serialize-javascript';
// @ts-expect-error
import * as Routes from '_build/routes';

const { FeRoutes } = require(require.resolve('_build/routes2'));

const Layout = React.lazy(getLayout);

const { layoutFetch, PrefixRouterBase, state } =
  Routes as ReactRoutesType;

// declare const global: IGlobal

const serverRender = async (
  ctx: ISSRContext,
  config: IConfig,
): Promise<React.ReactElement> => {
  const {
    cssOrder,
    jsOrder,
    dynamic,
    ssr = true,
    parallelFetch,
    prefix,
  } = config;
  // global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
  let path = ctx.request.path; // 这里取 pathname 不能够包含 queryString
  const base = prefix ?? PrefixRouterBase; // 以开发者实际传入的为最高优先级
  if (base) {
    path = normalizePath(config, path, base);
  }
  const routeItem = findRoute<ReactESMFeRouteItem>(FeRoutes, path);

  if (!routeItem) {
    throw new Error(`
    查找组件失败，请确认当前 path: ${path} 对应前端组件是否存在
    若创建了新的页面文件夹，请重新执行 npm start 重启服务
    `);
  }

  let dynamicCssOrder = cssOrder;

  if (dynamic) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`]);
    dynamicCssOrder = await addAsyncChunk(
      dynamicCssOrder,
      routeItem.webpackChunkName,
    );
  }
  const manifest = await getManifest(config);

  const injectCss: JSX.Element[] = [];
  const preloadCss: JSX.Element[] = [];

  dynamicCssOrder.forEach((css: string) => {
    if (manifest[css]) {
      const item = manifest[css];
      injectCss.push(<link rel='stylesheet' key={item} href={item} />);
      preloadCss.push(<link rel='preload' key={item} href={item} as='style' />);
    }
  });

  const injectScript = jsOrder
    .map((js: string) => manifest[js])
    .map((item: string) => <script key={item} src={item} async />);
  const preloadScript = jsOrder
    .map((js: string) => manifest[js])
    .map((item: string) => (
      <link rel='preload' as='script' key={item} href={item} />
    ));

  const staticList = {
    injectCss,
    injectScript,
    preloadScript,
    preloadCss,
  };

  const isCsr = !!(!ssr || ctx.request.query?.csr);
  const { component, fetch } = routeItem;
  const { default: Component, fetch: compFetch } = await component();

  let layoutFetchData = {};
  let fetchData = {};
  if (!isCsr) {
    const currentFetch = compFetch
      ? compFetch
      : fetch
        ? (await fetch()).default
        : null;

    // csr 下不需要服务端获取数据
    if (parallelFetch) {
      [layoutFetchData, fetchData] = await Promise.all([
        layoutFetch ? layoutFetch({ ctx }) : Promise.resolve({}),
        currentFetch ? currentFetch({ ctx }) : Promise.resolve({}),
      ]);
    } else {
      layoutFetchData = layoutFetch ? await layoutFetch({ ctx }) : {};
      fetchData = currentFetch ? await currentFetch({ ctx }) : {};
    }
  }
  const combineData = isCsr
    ? null
    : Object.assign(state ?? {}, layoutFetchData ?? {}, fetchData ?? {});

  const injectState = isCsr ? null : (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__USE_SSR__=true;window.__INITIAL_DATA__=${serialize(
          combineData,
        )};window.pageProps=${serialize(fetchData)}`,
      }}
    />
  );

  return (
    <StaticRouter location={ctx.request.url} basename={base}>
      <Context.Provider value={{ state: combineData }}>
        <React.Suspense fallback={<div>Loading</div>}>
          <Layout
            ctx={ctx}
            config={config}
            staticList={staticList}
            injectState={injectState}
            state={combineData}
          >
            {isCsr ? <></> : <Component {...fetchData} />}
          </Layout>
        </React.Suspense>
      </Context.Provider>
    </StaticRouter>
  );
};

export { serverRender };
