import { exec } from 'child_process'
import * as ora from 'ora';
import { IConfig } from '@aora/types';
const spinner = ora('starting')

export const start = (_config: IConfig) => {
  return new Promise<void>((resolve, reject) => {
  spinner.start()
  const { stdout, stderr } = exec('npx nest start --watch', {
    env: { ...process.env, FORCE_COLOR: '1' }
  })
  stdout?.on('data', function (data) {
    console.log(data)
    if (data.match('Nest application successfully started')) {
      spinner.stop()
      resolve()
    }
  })
  stderr?.on('data', function (data) {
    console.error(`error: ${data}`)
    reject(data)
  })
})
}
