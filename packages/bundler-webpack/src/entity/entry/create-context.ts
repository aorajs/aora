// The file is provisional，don't depend on it

import { createContext } from 'react'
import { IContext } from '../../types'

const STORE_CONTEXT = createContext<IContext>({
  state: {}
})

export {
  STORE_CONTEXT
}
