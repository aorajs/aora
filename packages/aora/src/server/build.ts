import { exec } from 'child_process'
import * as ora from 'ora';
const spinner = ora('正在构建')

const build = () => {
  spinner.start()
  exec('npx nest build', () => {
    spinner.stop()
  })
}

export {
  build
}
