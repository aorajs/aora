import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { DynamicFC, StaticFC, Action, IWindow, ReactFetch } from '../types'
// @ts-expect-error
import { STORE_CONTEXT } from '_build/create-context'

declare const window: IWindow

let hasRender = false

interface fetchType {
  fetch?: ReactFetch
  layoutFetch?: ReactFetch
}

const fetchAndDispatch = async ({ fetch, layoutFetch }: fetchType, dispatch: React.Dispatch<Action>, routerProps: RouteComponentProps, state: any) => {
  let asyncLayoutData = {}
  let asyncData = {}
  if (layoutFetch) {
    asyncLayoutData = await layoutFetch({ routerProps, state })
  }
  if (fetch) {
    asyncData = await fetch({ routerProps, state })
  }

  const combineData = Object.assign({}, asyncLayoutData, asyncData)

  await dispatch({
    type: 'updateContext',
    payload: combineData
  })
}

function wrapComponent (WrappedComponent: DynamicFC|StaticFC) {
  return withRouter(props => {
    const [ready, setReady] = useState(WrappedComponent.name !== 'dynamicComponent')
    const { state, dispatch } = useContext(STORE_CONTEXT)

    useEffect(() => {
      didMount()
    }, [])

    const didMount = async () => {
      if (hasRender || !window.__USE_SSR__) {
        // ssr 情况下只有路由切换的时候才需要调用 fetch
        // csr 情况首次访问页面也需要调用 fetch
        const { layoutFetch, fetch } = (WrappedComponent as DynamicFC)
        await fetchAndDispatch({ fetch, layoutFetch }, dispatch, props, state)
        if (WrappedComponent.name === 'dynamicComponent') {
          const { default: Component } = (await (WrappedComponent as DynamicFC)())
          WrappedComponent = Component
          WrappedComponent.fetch = fetch
          WrappedComponent.layoutFetch = layoutFetch
          setReady(true)
        }
      }
      hasRender = true
    }
    return (
      ready ? <WrappedComponent {...props}></WrappedComponent> : null
    )
  })
}

export {
  wrapComponent
}
