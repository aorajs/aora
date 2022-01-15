import { join } from 'path'
import { getLocalNodeModules, nodeExternals, uniqueWhitelist } from '../../utils'
import WebpackChain from 'webpack-chain'
import webpack from 'webpack'
import { getBaseConfig } from './base'
// @ts-ignore
import { IConfig } from 'aora/types'

export const getServerWebpack = (config: IConfig) => {
  const { isDev, cwd, getOutput, chainServerConfig, whiteList, chunkName } = config
  const chain = new WebpackChain()
  getBaseConfig(chain, config, true)
  chain.devtool(isDev ? 'inline-source-map' : false)
  chain.target('node')
  chain.entry(chunkName)
    .add(join(__dirname, '../entry/server-entry'))
    .end()
    .output
    .path(getOutput().serverOutPut)
    .filename('[name].server.js')
    .libraryTarget('commonjs')

  const modulesDir = [join(cwd, './node_modules')]
  modulesDir.push(getLocalNodeModules())

  chain.externals(nodeExternals({
  whitelist: uniqueWhitelist([/\.(css|less|sass|scss)$/, /react-vant.*?style/, /antd.*?(style)/, /store$/, /antd-mobile.*/, /@babel*/].concat(whiteList || [])),
  // externals Dir contains example/xxx/node_modules ssr/node_modules
    modulesDir
  }))

  chain.when(isDev, () => {
    chain.watch(true)
  })

  chain.plugin('serverLimit').use(webpack.optimize.LimitChunkCountPlugin, [{
    maxChunks: 1
  }])

  chainServerConfig(chain) // 合并用户自定义配置

  return chain.toConfig()
}
