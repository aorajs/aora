// @ts-ignore
import { IConfig } from 'aora/types'
import { getServerWebpack } from '../entity/config'
import { webpackPromisify } from './utils/promisify'

export const startServerBuild = async (config: IConfig) => {
  const webpackConfig = getServerWebpack(config)
  const { webpackStatsOption } = config
  const stats = await webpackPromisify(webpackConfig)
  console.log(stats.toString(webpackStatsOption))
}
