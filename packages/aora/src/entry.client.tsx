import {
  IWindow,
  LayoutProps,
  ReactESMFeRouteItem,
  ReactRoutesType,
} from '@aora/types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// @ts-expect-error
import * as AoraRoutes from '_build/routes';
import { AppContext } from './client/app.context';
import { preloadComponent } from './client/preload';
import { withFetch } from './client/withFetch';

const { FeRoutes, layoutFetch, App, PrefixRouterBase } =
  AoraRoutes as ReactRoutesType;

declare const module: any;
declare const window: IWindow;

const clientRender = async (): Promise<void> => {
  const IApp =
    App ??
    function (props: LayoutProps) {
      return props.children!;
    };
  // 客户端渲染||hydrate
  const baseName = window.prefix ?? PrefixRouterBase;
  const routes = await preloadComponent(FeRoutes, baseName);
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <AppContext>
      <BrowserRouter basename={baseName}>
        <IApp>
          <Routes>
            {/* <IApp> */}
            {/* <Switch> */}
            {
              // 使用高阶组件wrapComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
              routes.map((item: ReactESMFeRouteItem) => {
                const { component, path, fetch } = item;
                component.fetch = fetch;
                component.layoutFetch = layoutFetch;
                const WrappedComponent = withFetch(component);
                return (
                  <Route
                    key={path}
                    path={path}
                    element={<WrappedComponent key={location.pathname} />}
                  />
                );
              })
            }
            {/* </Switch> */}
            {/* </IApp> */}
          </Routes>
        </IApp>
      </BrowserRouter>
    </AppContext>,
    document.getElementById('app'),
  );

  module?.hot?.accept?.(); // webpack 场景下的 hmr
};

// 如果服务端直出的时候带上该记号，则默认不进行客户端渲染，将处理逻辑交给上层
// 可用于微前端场景下自定义什么时候进行组件渲染的逻辑调用
clientRender();

export { clientRender };
