import { exec } from 'child_process'
import { logGreen, loadConfig } from '../utils'
import * as ora from 'ora';
const spinner = ora('starting')

export const start = () => {
  return new Promise<void>((resolve, reject) => {

  const { serverPort, nestStartTips } = loadConfig()
  spinner.start()
  const { stdout, stderr } = exec('npx nest start --watch', {
    env: { ...process.env, FORCE_COLOR: '1' }
  } /* options, [optional] */)
  stdout?.on('data', function (data) {
    console.log(data)
    if (data.match('Nest application successfully started')) {
      spinner.stop()
      const https = process.env.HTTPS
      logGreen(nestStartTips ?? `Server is listening on ${https ? 'https' : 'http'}://localhost:${serverPort}`)
      resolve()
    }
  })
  stderr?.on('data', function (data) {
    console.error(`error: ${data}`)
    reject(data)
  })
})
}
