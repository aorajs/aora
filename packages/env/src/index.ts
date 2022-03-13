type Log = {
  info: (...args: any[]) => void
  error: (...args: any[]) => void
}

export function loadEnvConfig(
  dir: string,
  dev?: boolean,
  log: Log = console
) {
  log.info(dir, dev)
  return {}
}
