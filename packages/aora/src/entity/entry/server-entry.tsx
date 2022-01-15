import * as React from 'react'
// @ts-ignore
import { StaticRouter } from 'react-router-dom'
// @ts-ignore
import { findRoute, getManifest, normalizePath, addAsyncChunk } from 'aora'
// @ts-ignore
import { ISSRContext, IConfig, ReactRoutesType, ReactESMFeRouteItem } from 'aora/types'
import serialize from 'serialize-javascript'
// @ts-expect-error
import { FeRoutes, layoutFetch, PrefixRouterBase, state } from '_build/ssr-temporary-routes'
// @ts-ignore
import { STORE_CONTEXT as Context } from 'aora/context'
// @ts-ignore
import Layout from '@/layouts/index.tsx'

// declare const global: IGlobal

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<React.ReactElement> => {
  const { cssOrder, jsOrder, dynamic, ssr = true, parallelFetch, prefix } = config
  // global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
  let path = ctx.request.path // 这里取 pathname 不能够包含 queryString
  const base = prefix ?? PrefixRouterBase // 以开发者实际传入的为最高优先级
  if (base) {
    path = normalizePath(config, path, base)
  }
  const routeItem = findRoute<ReactESMFeRouteItem>(FeRoutes, path)

  if (!routeItem) {
    throw new Error(`
    查找组件失败，请确认当前 path: ${path} 对应前端组件是否存在
    若创建了新的页面文件夹，请重新执行 npm start 重启服务
    `)
  }

  let dynamicCssOrder = cssOrder

  if (dynamic) {
    dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
    dynamicCssOrder = await addAsyncChunk(dynamicCssOrder, routeItem.webpackChunkName)
  }
  const manifest = await getManifest(config)

  const injectCss: JSX.Element[] = []
  const preloadCss: JSX.Element[] = []

  dynamicCssOrder.forEach((css: string) => {
    if (manifest[css]) {
      const item = manifest[css]
      injectCss.push(<link rel='stylesheet' key={item} href={item} />)
      preloadCss.push(<link rel="preload" key={item} href={item} as="style" />)
    }
  })

  // if (disableClientRender) {
  //   injectCss.push(<script key="disableClientRender" dangerouslySetInnerHTML={{
  //     __html: 'window.__disableClientRender__ = true'
  //   }}/>)
  // }

  const injectScript = jsOrder.map((js: string) => manifest[js]).map((item: string) => <script key={item} src={item} async />)
  const preloadScript = jsOrder.map((js: string) => manifest[js]).map((item: string) => <link rel="preload" as="script" key={item} href={item} />)

  const staticList = {
    injectCss,
    injectScript,
    preloadScript,
    preloadCss,
  }

  const isCsr = !!(!ssr|| ctx.request.query?.csr)
  const { component, fetch } = routeItem
  const { default: Component, fetch: compFetch } = (await component())

  let layoutFetchData = {}
  let fetchData = {}
  if (!isCsr) {
    const currentFetch = compFetch ? compFetch : (fetch ? (await fetch()).default : null)

    // csr 下不需要服务端获取数据
    if (parallelFetch) {
      [layoutFetchData, fetchData] = await Promise.all([
        layoutFetch ? layoutFetch({ ctx }) : Promise.resolve({}),
        currentFetch ? currentFetch({ ctx }) : Promise.resolve({})
      ])
    } else {
      layoutFetchData = layoutFetch ? await layoutFetch({ ctx }) : {}
      fetchData = currentFetch ? await currentFetch({ ctx }) : {}
    }
  }
  const combineData = isCsr ? null : Object.assign(state ?? {}, layoutFetchData ?? {}, fetchData ?? {})

  const injectState = isCsr ? null : <script dangerouslySetInnerHTML={{
    __html: `window.__USE_SSR__=true;window.__INITIAL_DATA__=${serialize(combineData)};window.pageProps=${serialize(fetchData)}`
  }} />

  return (
    <StaticRouter location={ctx.request.url} basename={base}>
      <Context.Provider value={{ state: combineData }}>
        <Layout ctx={ctx} config={config} staticList={staticList} injectState={injectState} state={combineData}>
          {isCsr ? <></> : <Component {...fetchData}/>}
        </Layout>
      </Context.Provider>
    </StaticRouter>
  )
}

export {
  serverRender
}
