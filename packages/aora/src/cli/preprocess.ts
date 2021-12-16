import { promises as fsp } from 'fs'
import { join } from 'path'
import { transform } from 'esbuild'
import { Argv, IConfig } from '@aora/types'
import { loadConfig } from '..'

export const handleEnv = async (_argv: Argv, _spinner: any, https: IConfig['https']) => {
  process.env.BUILD_TOOL = 'webpack'
  process.env.NODE_ENV = 'development'
  if (https) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
}

export const transformConfig = async () => {
  const { accessFile, getCwd } = await import('../utils')
  const cwd = getCwd()
  if (!await accessFile(join(cwd, './build'))) {
    fsp.mkdir(join(cwd, './build'))
  }
  if (await accessFile(join(cwd, './config.js'))) {
    fsp.copyFile(`${join(cwd, './config.js')}`, `${join(cwd, './build/config.js')}`)
  }
  const configWithTs = await accessFile(join(cwd, './config.ts'))
  if (configWithTs) {
    const fileContent = (await fsp.readFile(join(cwd, './config.ts'))).toString()
    const { code } = await transform(fileContent, {
      loader: 'ts',
      format: 'cjs'
    })
    await fsp.writeFile(join(cwd, './build/config.js'), code)
  }
  return loadConfig()
}
