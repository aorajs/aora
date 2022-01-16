/// <reference types="node" />
import { exec } from 'child_process';
declare const getCwd: () => string;
declare const getFeDir: () => string;
export declare const uniqueWhitelist: (list: (string | RegExp)[]) => (string | RegExp)[];
declare const getPagesDir: () => string;
declare const getUserConfig: () => UserConfig;
declare const loadPlugin: () => IPlugin;
declare const readAsyncChunk: () => Promise<Record<string, string>>;
declare const addAsyncChunk: (dynamicCssOrder: string[], webpackChunkName: string) => Promise<string[]>;
declare const cryptoAsyncChunkName: (chunks: any, asyncChunkMap: Record<string, string>) => string;
declare const getLocalNodeModules: () => string;
declare const processError: (err: any) => void;
declare const accessFile: (file: string) => Promise<boolean>;
declare const copyReactContext: () => Promise<void>;
declare const execPromisify: typeof exec.__promisify__;
declare const normalizeStartPath: (path: string) => string;
declare const normalizeEndPath: (path: string) => string;
export { getCwd, getFeDir, getPagesDir, getUserConfig, loadPlugin, getLocalNodeModules, processError, accessFile, execPromisify, readAsyncChunk, addAsyncChunk, cryptoAsyncChunkName, normalizeStartPath, normalizeEndPath, copyReactContext };
//# sourceMappingURL=cwd.d.ts.map