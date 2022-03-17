import { loadEnvConfig } from '@aora/env';

export async function loadConfig(dir: string) {
  const data = loadEnvConfig(dir);
  console.log(dir);
  console.log(data);

}
