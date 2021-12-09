import * as React from 'react'
import { findRoute, getManifest, logGreen, normalizePath, addAsyncChunk } from '../../utils'
import { ISSRContext, IGlobal, IConfig, ReactRoutesType, ReactESMFeRouteItem } from '../../types'
import * as serialize from 'serialize-javascript'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'
// @ts-expect-error
import { STORE_CONTEXT as Context } from '_build/create-context'
// @ts-expect-error
import Layout from '@/components/layout/index.tsx'

const { FeRoutes, layoutFetch, PrefixRouterBase, state } = Routes as ReactRoutesType

declare const global: IGlobal

const serverRender = async (ctx: ISSRContext, config: IConfig): Promise<React.ReactElement> => {
  const { cssOrder, jsOrder, dynamic, mode, parallelFetch, disableClientRender, prefix } = config
  global.window = global.window ?? {} // 防止覆盖上层应用自己定义的 window 对象
  let path = ctx.request.path // 这里取 pathname 不能够包含 queryString
  const base = prefix ?? PrefixRouterBase // 以开发者实际传入的为最高优先级
  if (base) {
    path = normalizePath(path, base)
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
  const manifest = await getManifest()

  const injectCss: JSX.Element[] = []
  
  dynamicCssOrder.forEach(css => {
    if (manifest[css]) {
      const item = manifest[css]
      injectCss.push(<link rel='stylesheet' key={item} href={item} />)
    }
  })

  if (disableClientRender) {
    injectCss.push(<script key="disableClientRender" dangerouslySetInnerHTML={{
      __html: 'window.__disableClientRender__ = true'
    }}/>)
  }

  const injectScript = jsOrder.map(js => manifest[js]).map(item => <script key={item} src={item} />)

  const staticList = {
    injectCss,
    injectScript
  }

  const isCsr = !!(mode === 'csr' || ctx.request.query?.csr)
  const { component, fetch } = routeItem
  const Component = (await component()).default

  if (isCsr) {
    logGreen(`Current path ${path} use csr render mode`)
  }
  let layoutFetchData = {}
  let fetchData = {}
  if (!isCsr) {
    const currentFetch = fetch ? (await fetch()).default : null

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
    __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(combineData)}`
  }} />

  return (
    <Context.Provider value={{ state: combineData }}>
      <Layout ctx={ctx} config={config} staticList={staticList} injectState={injectState}>
        {isCsr ? <></> : <Component />}
      </Layout>
    </Context.Provider>
  )
}

export {
  serverRender
}
