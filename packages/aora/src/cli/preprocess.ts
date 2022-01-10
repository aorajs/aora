import { promises as fsp } from 'fs'
import { join } from 'path'
import { transform } from 'esbuild'
// @ts-ignore
import { Argv, IConfig } from 'aora/types'
import { loadConfig } from '..'

export interface ResolveModuleOptions {
  paths?: string | string[]
}

export interface RequireModuleOptions extends ResolveModuleOptions {
  // TODO: use create-require for jest environment
  // native?: boolean
  /** Clear the require cache (force fresh require) but only if not within `node_modules` */
  clearCache?: boolean

  /** Automatically de-default the result of requiring the module. */
  interopDefault?: boolean
}

export function isNodeModules (id: string) {
  // TODO: Follow symlinks
  return /[/\\]node_modules[/\\]/.test(id)
}

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
  if (!await accessFile(join(cwd, './aora'))) {
    await fsp.mkdir(join(cwd, './.aora'), {recursive: true})
    }
  const configWithTs = await accessFile(join(cwd, './.aorarc.ts'))
  if (configWithTs) {
    const fileContent = (await fsp.readFile(join(cwd, './.aorarc.ts'))).toString()
    const { code } = await transform(fileContent, {
      loader: 'ts',
      format: 'cjs',
      charset: 'utf8',
    })
    await fsp.writeFile(join(cwd, './.aora/.aorarc.js'), code)
  }
  await fsp.mkdir(join(cwd, '.aora/client'), { recursive: true })
  // await fsp.link(join(cwd, '.aora/client'), join(cwd, 'public/_aora'))
  return loadConfig()
}
