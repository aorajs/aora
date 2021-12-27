import { resolve } from 'path'
import { renderToString, renderToNodeStream } from 'react-dom/server'
import { loadConfig, getCwd, StringToStream, mergeStream2 } from './utils'
import { ISSRContext, UserConfig, ExpressContext } from '@aora/types'

const cwd = getCwd()
const defaultConfig = loadConfig()
const { chunkName } = defaultConfig
const serverFile = resolve(cwd, `./.aora/server/${chunkName}.server.js`)
const { serverRender } = require(serverFile)

export function render (ctx: ISSRContext, options?: UserConfig): Promise<string>
export function render<T> (ctx: ISSRContext, options?: UserConfig): Promise<T>
export async function render (ctx: ISSRContext, options?: UserConfig) {
  const config = Object.assign({}, defaultConfig, options ?? {})
  const { stream } = config
  // const isLocal = isDev || process.env.NODE_ENV !== 'production'
  // if (isLocal) {
  //   // clear cache in development environment
  //   delete require.cache[serverFile]
  // }
  const serverRes = await serverRender(ctx, config)

  if (!(ctx as ExpressContext).response.hasHeader?.('content-type')) {
    // express 场景
    (ctx as ExpressContext).response.setHeader?.('Content-type', 'text/html;charset=utf-8')
  }

  if (stream) {
    const stream = mergeStream2(new StringToStream('<!DOCTYPE html>'), renderToNodeStream(serverRes))
    stream.on('error', (e: any) => {
      console.log(e)
    })
    return stream
  } else {
    return '<!DOCTYPE html>' + renderToString(serverRes)
  }
}

export default render
