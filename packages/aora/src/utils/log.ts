import * as colorette from 'colorette'

export const prefixes = {
  wait: colorette.cyan('wait') + '  -',
  error: colorette.red('error') + ' -',
  warn: colorette.yellow('warn') + '  -',
  ready: colorette.green('ready') + ' -',
  info: colorette.cyan('info') + '  -',
  event: colorette.magenta('event') + ' -',
  trace: colorette.magenta('trace') + ' -',
}

export function wait(...message: string[]) {
  console.log(prefixes.wait, ...message)
}

export function error(...message: string[]) {
  console.error(prefixes.error, ...message)
}

export function warn(...message: string[]) {
  console.warn(prefixes.warn, ...message)
}

export function ready(...message: string[]) {
  console.log(prefixes.ready, ...message)
}

export function info(...message: string[]) {
  console.log(prefixes.info, ...message)
}

export function event(...message: string[]) {
  console.log(prefixes.event, ...message)
}

export function trace(...message: string[]) {
  console.log(prefixes.trace, ...message)
}
