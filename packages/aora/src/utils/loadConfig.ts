import { readConfig } from '@aora/cli';
import { IConfig } from '@aora/types';

let cacheConfig: IConfig | null = null;

const loadConfig = (): IConfig => {
  if (cacheConfig && !cacheConfig.isDev) {
    return {
      ...cacheConfig,
    };
  }
  const config = readConfig();
  cacheConfig = config;
  return config;
};

export { loadConfig };
