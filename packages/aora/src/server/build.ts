// @ts-ignore
import { IConfig } from 'aora/types';
import { exec } from 'child_process'
import * as ora from 'ora';
const spinner = ora('正在构建')

export const build = (_config: IConfig) => {
  return new Promise<void>((resolve) =>{
    spinner.start()
    exec('npx nest build', () => {
      spinner.stop()
      resolve()
    })
  })
}
