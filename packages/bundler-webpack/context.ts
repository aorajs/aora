// The file is provisional，don't depend on it
import { createContext } from 'react'
import { IContext } from '@aora/bundler-webpack/dist/types'

let STORE_CONTEXT
// @ts-ignore
if (__isBrowser__) {
  // @ts-ignore
  STORE_CONTEXT = window.STORE_CONTEXT || createContext<IContext>({
    state: {}
  })
  // @ts-ignore
  window.STORE_CONTEXT = STORE_CONTEXT
} else {
  STORE_CONTEXT = createContext<IContext>({
    state: {}
  })
}

export {
  STORE_CONTEXT
}
