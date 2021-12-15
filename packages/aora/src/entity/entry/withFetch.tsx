import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { DynamicFC, StaticFC, Action, IWindow, ReactFetch } from "@aora/types";
// @ts-ignore
import { STORE_CONTEXT } from "aora/context";

declare const window: IWindow;

let hasRender = false;

interface fetchType {
  fetch?: ReactFetch;
  layoutFetch?: ReactFetch;
}

const fetchAndDispatch = async (
  { fetch, layoutFetch }: fetchType,
  dispatch: React.Dispatch<Action> | undefined,
  routerProps: RouteComponentProps,
  state: any
) => {
  let asyncLayoutData = {};
  let asyncData = {};
  if (layoutFetch) {
    asyncLayoutData = await layoutFetch({ routerProps, state });
  }
  if (fetch) {
    asyncData = await fetch({ routerProps, state });
  }

  const combineData = Object.assign({}, asyncLayoutData, asyncData);

  await dispatch?.({
    type: "updateContext",
    payload: combineData,
  });
  return asyncData;
};

export function withFetch(WrappedComponent: DynamicFC | StaticFC) {
  return withRouter(function withRouter(props) {
    const { state, dispatch } = useContext(STORE_CONTEXT);
    // @ts-ignore
    const [pageProps, setPageProps] = useState({...window.pageProps || {}});

    useEffect(() => {
      didMount();
    }, []);

    const didMount = async () => {
      if (hasRender || !window.__USE_SSR__) {
        // ssr 情况下只有路由切换的时候才需要调用 fetch
        // csr 情况首次访问页面也需要调用 fetch
        const { layoutFetch, fetch } = WrappedComponent as DynamicFC;
        const _pageProps = await fetchAndDispatch(
          { fetch, layoutFetch },
          dispatch,
          props,
          state
        );
        setPageProps(_pageProps);
      }
      hasRender = true;
    };
    return <WrappedComponent {...pageProps} {...props} />;
  });
}
