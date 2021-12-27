import { join } from 'path'
import axios from 'axios'
import { promises } from 'fs'
import { getCwd } from './cwd'
import { IConfig } from '@aora/types'

// 创建一个实例来请求，防止业务代码的 axios 设置了 defaults 配置导致获取 manifest 失败
const instance = axios.create({
  timeout: 3000,
  proxy: false
})

const _getManiFest = async (config: IConfig): Promise<Record<string, string>> => {
  const { isDev, fePort, https, manifestPath } = config
  let manifest = {}
  const cwd = getCwd()
  if (isDev) {
    const res = await instance.get(`${https ? 'https' : 'http'}://localhost:${fePort}${manifestPath}`)
    manifest = res.data
  } else {
    manifest = JSON.parse(
      await promises.readFile(join(cwd, "./.aora/client/asset-manifest.json"), {
        encoding: "utf-8",
      })
    );
  }
  return manifest
}

export const getManifest = async (config: IConfig) => {
  return await _getManiFest(config)
}

