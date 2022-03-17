import { IConfig } from '@aora/types';
import { promises } from 'fs';
import { join } from 'path';
import { getCwd } from './cwd';
import fetch from 'node-fetch';

const _getManiFest = async (
  config: IConfig,
): Promise<Record<string, string>> => {
  const { isDev, fePort, https, manifestPath } = config;
  let manifest = {};
  const cwd = getCwd();
  if (isDev) {
    const res: any = await (fetch(
      `${https ? 'https' : 'http'}://localhost:${fePort}${manifestPath}`,
    ).then(res => res.json()));
    console.log(res);
    manifest = res;
  } else {
    manifest = JSON.parse(
      await promises.readFile(join(cwd, './public/build/asset-manifest.json'), {
        encoding: 'utf-8',
      }),
    );
  }
  return manifest;
};

export const getManifest = async (config: IConfig) => {
  return await _getManiFest(config);
};
