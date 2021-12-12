import { exec } from 'child_process'
import * as ora from 'ora';
const spinner = ora('正在构建')

export const build = () => {
  return new Promise<void>((resolve) =>{
    spinner.start()
    exec('npx nest build', () => {
      spinner.stop()
      resolve()
    })
  })
}
