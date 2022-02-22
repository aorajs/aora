import type { INestApplication } from '@nestjs/common';
import * as path from 'path';

export type CustomFactory = (modules: any[]) => Promise<INestApplication>;

export const defineCustom = (factory: CustomFactory): CustomFactory => factory;
export const NEST_APP_ENTRY_NAME = 'main';

export async function startAoraServer(app: INestApplication, config: any) {
  await app.init();
  await app.listen(config.serverPort);
}

/**
 * Require function compatible with esm and cjs module.
 * @param filePath - File to required.
 * @returns module export object.
 */
export const compatRequire = async (filePath: string) => {
  const mod = await import(filePath);

  return mod?.__esModule ? mod.default : mod;
};

export const MODULE_MODULE_FILE_EXTENSIONS = [
  '.js',
  '.mjs',
  '.ejs',
  '.ts',
  '.tsx',
];

export const getCustomApp = (
  pwd: string,
): Promise<INestApplication | CustomFactory | undefined> => {
  const entryPath = path.resolve(pwd, 'src', NEST_APP_ENTRY_NAME);
  return compatRequire(entryPath);
};
