import { promises } from 'fs'
import { join } from 'path'
import { transform } from 'esbuild'
import { cp, mkdir } from 'shelljs'
import { Argv } from '../types'

export const handleEnv = async (_argv: Argv, _spinner: any) => {
  process.env.BUILD_TOOL = 'webpack'
  process.env.NODE_ENV = 'development'
  const { loadConfig } = await import('../utils')
  const { https } = loadConfig()
  if (https) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }
}

export const transformConfig = async () => {
  const { accessFile, getCwd } = await import('../utils')
  const cwd = getCwd()
  if (!await accessFile(join(cwd, './build'))) {
    mkdir(join(cwd, './build'))
  }
  if (await accessFile(join(cwd, './config.js'))) {
    cp('-r', `${join(cwd, './config.js')}`, `${join(cwd, './build/config.js')}`)
  }
  const configWithTs = await accessFile(join(cwd, './config.ts'))
  if (configWithTs) {
    const fileContent = (await promises.readFile(join(cwd, './config.ts'))).toString()
    const { code } = await transform(fileContent, {
      loader: 'ts',
      format: 'cjs'
    })
    await promises.writeFile(join(cwd, './build/config.js'), code)
  }
}
