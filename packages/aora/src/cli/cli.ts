#!/usr/bin/env node
import { resolve } from 'path'
import { fork } from 'child_process'
import * as yargs from 'yargs'
// @ts-ignore
import { Argv } from 'aora/types'
import { transformConfig, handleEnv } from './preprocess'
import { Aora } from '../entity/config'

const spinnerProcess = fork(resolve(__dirname, './spinner')) // 单独创建子进程跑 spinner 否则会被后续的 同步代码 block 导致 loading 暂停

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
    spinner.stop()
    await aora.startClient()
    // await aora.clean()
    await aora.startServer()
    await aora.setupBuildId()
  })
  .command('build', 'Build server and client files', {}, async () => {
    spinner.start()
    process.env.NODE_ENV = 'production'
    const config = await transformConfig()
    const aora = new Aora(config)
    await aora.parseRoutes()
    spinner.stop()
    await aora.buildClient()
    // await aora.clean()
    await aora.buildServer()
    await aora.setupBuildId()
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .fail((msg, err) => {
    if (err) {
      console.log(err)
      spinner.stop()
      process.exit(1)
    }
    console.log(msg)
  })
  .parse()
