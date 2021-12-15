#!/usr/bin/env node
import { resolve } from 'path'
import { fork } from 'child_process'
import * as yargs from 'yargs'
import { Argv } from '@aora/types'
import { transformConfig, handleEnv } from './preprocess'
import { Aora } from '../entity/config'

const spinnerProcess = fork(resolve(__dirname, './spinner')) // 单独创建子进程跑 spinner 否则会被后续的 同步代码 block 导致 loading 暂停
const debug = require('debug')('ssr:cli')
const start = Date.now()
const spinner = {
  start: () => spinnerProcess.send({
    message: 'start'
  }),
  stop: () => spinnerProcess.send({
    message: 'stop'
  })
}

yargs
.version(false)
  .command('start', 'Start Server', {}, async (argv: Argv) => {
    spinner.start()
    const config = await transformConfig()
    await handleEnv(argv, spinner, config.https)
    const aora = new Aora(config)
    await aora.parseRoutes()
    debug(`require ssr-server-utils time: ${Date.now() - start} ms`)
    debug(`loadPlugin time: ${Date.now() - start} ms`)
    spinner.stop()
    // const { start: client } = await import('../entity')
    debug(`parseFeRoutes ending time: ${Date.now() - start} ms`)
    await aora.startClient()
    debug(`clientPlugin ending time: ${Date.now() - start} ms`)
    await aora.clean()
    await aora.startServer()
    debug(`serverPlugin ending time: ${Date.now() - start} ms`)
  })
  .command('build', 'Build server and client files', {}, async () => {
    spinner.start()
    process.env.NODE_ENV = 'production'
    const config = await transformConfig()
    const aora = new Aora(config)
    await aora.parseRoutes()
    spinner.stop()
    await aora.buildClient()
    await aora.clean()
    await aora.buildServer()
  })
  .command('deploy', 'Deploy function to aliyun cloud or tencent cloud', {}, async (argv: Argv) => {
    process.env.NODE_ENV = 'production'
    const { loadPlugin } = await import('../utils')
    const plugin = loadPlugin()

    if (!plugin?.serverPlugin?.deploy) {
      console.log('当前插件不支持 deploy 功能，请使用 ssr-plugin-midway 插件 参考 https://www.yuque.com/midwayjs/faas/migrate_egg 或扫码进群了解')
      return
    }
    process.env.NODE_ENV = 'production'
    await plugin.serverPlugin?.deploy?.(argv)
    spinner.stop()
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .option('version', {
    alias: 'v',
    default: false
  })
  .fail((msg, err) => {
    if (err) {
      console.log(err)
      spinner.stop()
      process.exit(1)
    }
    console.log(msg)
  })
  .parse()
