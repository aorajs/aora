import * as ora from 'ora';
const spinner = ora('正在构建')

interface Message {
  message: 'start' | 'stop'
}

process.on('message', (data: Message) => {
  const { message } = data
  if (message === 'start') {
    spinner.start()
  } else {
    spinner.stop()
    process.exit()
  }
})
