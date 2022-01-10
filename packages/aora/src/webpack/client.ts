// @ts-ignore
import { IConfig } from 'aora/types'
import * as webpack from 'webpack'
import { getClientWebpack } from '../entity/config'
import { webpackPromisify } from './utils/promisify'

// fork 后移除 webpack-dev-server 默认的启动 log，只展示服务端 Node.js 的启动监听端口
const WebpackDevServer = require('webpack-dev-server-ssr')

const startClientServer = async (config: IConfig): Promise<void> => {
  const { webpackDevServerConfig, fePort, host } = config
  const webpackConfig = getClientWebpack(config)
  return await new Promise((resolve) => {
    const compiler = webpack(webpackConfig)

    const server = new WebpackDevServer(compiler, webpackDevServerConfig)
    compiler.hooks.done.tap('DonePlugin', () => {
      resolve()
    })

    server.listen(fePort, host)
  })
}

const startClientBuild = async (config: IConfig) => {
  const { webpackStatsOption } = config
  const webpackConfig = getClientWebpack(config)
  const stats = await webpackPromisify(webpackConfig)
  console.log(stats.toString(webpackStatsOption))
}

export {
  startClientServer,
  startClientBuild
}
