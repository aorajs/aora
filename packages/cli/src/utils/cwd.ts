import { IPlugin, UserConfig } from '@aora/types';
import { exec } from 'child_process';
import { promises } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

const getCwd = () => {
  return resolve(process.cwd(), process.env.APP_ROOT ?? '');
};

const getFeDir = () => {
  return resolve(getCwd(), process.env.FE_ROOT ?? 'web');
};

export const uniqueWhitelist = (list: (string | RegExp)[]) => {
  const obj: Record<string, string | RegExp> = {};
  list.forEach((item) => {
    obj[String(item)] = item;
  });
  return Object.values(obj);
};

const getPagesDir = () => {
  return resolve(getFeDir(), 'pages');
};

// @ts-ignore
const rootDir = resolve(process.cwd(), '.');
const getUserConfig = (): UserConfig => {
  const config = require(resolve(getCwd(), './.aora/.aorarc'));
  return config?.default ?? {};
};

const loadPlugin = (): IPlugin => {
  return require(resolve(getCwd(), 'plugin'));
};

const readAsyncChunk = async (): Promise<Record<string, string>> => {
  const cwd = getCwd();
  try {
    const str = (
      await promises.readFile(resolve(cwd, './.aora/asyncChunkMap.json'))
    ).toString();
    return JSON.parse(str);
  } catch (error) {
    return {};
  }
};

const addAsyncChunk = async (
  dynamicCssOrder: string[],
  webpackChunkName: string,
) => {
  const arr = [];
  const asyncChunkMap = await readAsyncChunk();
  for (const key in asyncChunkMap) {
    if (asyncChunkMap[key].includes(webpackChunkName)) {
      arr.push(`${key}.css`);
    }
  }
  return arr.concat(dynamicCssOrder);
};
const cyrb53 = function(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const cryptoAsyncChunkName = (
  chunks: any,
  asyncChunkMap: Record<string, string>,
) => {
  // 加密异步模块 name，防止名称过长
  const allChunksNames = chunks.map((item: any) => item.name).join('~');
  const allChunksNamesArr = allChunksNames.split('~');

  const cryptoAllChunksNames = String(cyrb53(allChunksNames));
  if (allChunksNamesArr.length >= 2 && !asyncChunkMap[cryptoAllChunksNames]) {
    asyncChunkMap[cryptoAllChunksNames] = allChunksNamesArr;
  }
  return cryptoAllChunksNames;
};

const getLocalNodeModules = () => resolve(__dirname, '../../../node_modules');

const processError = (err: any) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
};
const accessFile = async (file: string) => {
  const result = await promises
    .access(file)
    .then(() => true)
    .catch(() => false);
  return result;
};

const copyReactContext = async () => {
  await promises.copyFile(
    resolve(__dirname, '../../context.ts'),
    resolve(getCwd(), './.aora/create-context.ts'),
  );
};

const execPromisify = promisify(exec);
const normalizeStartPath = (path: string) => {
  if (path.startsWith('//')) {
    path = path.replace('//', '/');
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
};
const normalizeEndPath = (path: string) => {
  if (!path.endsWith('/')) {
    path = `${path}/`;
  }
  return path;
};

export {
  getCwd,
  getFeDir,
  getPagesDir,
  getUserConfig,
  loadPlugin,
  getLocalNodeModules,
  processError,
  accessFile,
  execPromisify,
  readAsyncChunk,
  addAsyncChunk,
  cryptoAsyncChunkName,
  normalizeStartPath,
  normalizeEndPath,
  copyReactContext,
};

export const normalizePublicPath = (path: string) => {
  // 兼容 /pre /pre/ 两种情况
  if (!path.endsWith('/')) {
    path = `${path}/`;
  }
  return path;
};

export const getOutputPublicPath = (publicPath: string, isDev: boolean) => {
  const path = normalizePublicPath(publicPath);
  console.log('isDev', isDev);
  return `${path}build/`;
};
