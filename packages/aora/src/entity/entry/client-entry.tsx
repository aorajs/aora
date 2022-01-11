import * as React from 'react'
import * as ReactDOM from 'react-dom'
// @ts-ignore
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { preloadComponent } from './preload'
import { withFetch } from './withFetch'
// @ts-ignore
import { IWindow, LayoutProps, ReactESMFeRouteItem, ReactRoutesType } from 'aora/types'
// @ts-expect-error
import * as Routes from '_build/ssr-temporary-routes'
import { AppContext } from './app-context'

const { FeRoutes, layoutFetch, App, PrefixRouterBase } = Routes as ReactRoutesType

declare const module: any
declare const window: IWindow

const clientRender = async (): Promise<void> => {
  const IApp = App ?? function (props: LayoutProps) {
    return props.children!
  }
  // 客户端渲染||hydrate
  const baseName = window.prefix ?? PrefixRouterBase
  const routes = await preloadComponent(FeRoutes, baseName)
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    (<BrowserRouter basename={baseName}>
      <AppContext>
        <Switch>
          <IApp>
            <Switch>
              {
                // 使用高阶组件wrapComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
                routes.map((item: ReactESMFeRouteItem) => {
                  const { component, path, fetch } = item
                  component.fetch = fetch
                  component.layoutFetch = layoutFetch
                  const WrappedComponent = withFetch(component)
                  return (
                    // @ts-ignore
                    <Route exact={true} key={path} path={path} render={() => <WrappedComponent key={location.pathname}/>}/>
                  )
                })
              }
            </Switch>
          </IApp>
        </Switch>
      </AppContext>
    </BrowserRouter>)
    , document.getElementById('app'))
    module?.hot?.accept?.() // webpack 场景下的 hmr
}

clientRender()

export {
  clientRender
}
