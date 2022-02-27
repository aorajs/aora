// @ts-ignore
import Layout from '@/layouts/index.tsx';
import { AoraEntryContext, STORE_CONTEXT as Context } from '@aora/react';
import {
  IConfig,
  ISSRContext,
  ReactRoutesType,
} from '@aora/types';
// @ts-ignore
import { addAsyncChunk, findRoute, getManifest, normalizePath } from 'aora';
import * as React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import * as serialize from 'serialize-javascript';
// @ts-expect-error
import * as Routes from '_build/routes';

const { FeRoutes, layoutFetch, state } =
  Routes as ReactRoutesType;

// declare const global: IGlobal

const serverRender = async (
  data: unknown,
  ctx: ISSRContext,
  config: IConfig,
  {
    base,
    path
  } : {
    base: string;
    path: string;
    route: any
  }
): Promise<React.ReactElement> => {
  const {
    cssOrder,
    jsOrder,
    dynamic,
    ssr = true,
    parallelFetch,
  } = config;
  const routeItem: any = findRoute(FeRoutes, path);
  const { isDev, fePort } = config

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
      injectCss.push(<link rel="stylesheet" key={item} href={item} />);
      preloadCss.push(<link rel="preload" key={item} href={item} as="style" />);
    }
  });

  const injectScript = jsOrder
    .map((js: string) => manifest[js])
    .map((item: string) => <script key={item} src={item} async />);
  const preloadScript = jsOrder
    .map((js: string) => manifest[js])
    .map((item: string) => (
      <link rel="preload" as="script" key={item} href={item} />
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
        layoutFetch ? layoutFetch({ ctx, data }) : Promise.resolve({}),
        currentFetch ? currentFetch({ ctx, data }) : Promise.resolve({}),
      ]);
    } else {
      layoutFetchData = layoutFetch ? await layoutFetch({ ctx }) : {};
      fetchData = currentFetch ? await currentFetch({ ctx }) : {};
    }
  }
  const combineData = isCsr
    ? null
    : Object.assign(state ?? {}, layoutFetchData ?? {}, fetchData ?? {});

  return (
    <AoraEntryContext.Provider
      value={{
        manifest,
        serverHandoffString: isCsr
          ? undefined
          : `window.__USE_SSR__=true;window.__INITIAL_DATA__=${serialize(
              combineData,
            )};window.pageProps=${serialize(fetchData)}`,
      }}
    >
      <StaticRouter location={ctx.request.url} basename={base}>
        <Context.Provider value={{ state: combineData }}>
          <Layout
            ctx={ctx}
            config={config}
            staticList={staticList}
            state={combineData}
          >
            {isCsr ? <></> : <Component {...fetchData} />}
          </Layout>
        </Context.Provider>
      </StaticRouter>
    </AoraEntryContext.Provider>
  );
};

export { serverRender };
