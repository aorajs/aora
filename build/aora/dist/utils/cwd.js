"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyReactContext = exports.normalizeEndPath = exports.normalizeStartPath = exports.cryptoAsyncChunkName = exports.addAsyncChunk = exports.readAsyncChunk = exports.execPromisify = exports.accessFile = exports.processError = exports.getLocalNodeModules = exports.loadPlugin = exports.getUserConfig = exports.getPagesDir = exports.getFeDir = exports.getCwd = exports.uniqueWhitelist = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const child_process_1 = require("child_process");
const util_1 = require("util");
const getCwd = () => {
    var _a;
    return (0, path_1.resolve)(process.cwd(), (_a = process.env.APP_ROOT) !== null && _a !== void 0 ? _a : '');
};
exports.getCwd = getCwd;
const getFeDir = () => {
    var _a;
    return (0, path_1.resolve)(getCwd(), (_a = process.env.FE_ROOT) !== null && _a !== void 0 ? _a : 'app');
};
exports.getFeDir = getFeDir;
const uniqueWhitelist = (list) => {
    const obj = {};
    list.forEach(item => {
        obj[String(item)] = item;
    });
    return Object.values(obj);
};
exports.uniqueWhitelist = uniqueWhitelist;
const getPagesDir = () => {
    return (0, path_1.resolve)(getFeDir(), 'pages');
};
exports.getPagesDir = getPagesDir;
// @ts-ignore
const rootDir = (0, path_1.resolve)(process.cwd(), '.');
const getUserConfig = () => {
    var _a;
    const config = require((0, path_1.resolve)(getCwd(), './.aora/.aorarc'));
    // const config = jitiImport(rootDir, resolve(getCwd(),'.aorarc.ts'))
    console.log('config', config.default);
    // return config.userConfig ?? config
    return (_a = config === null || config === void 0 ? void 0 : config.default) !== null && _a !== void 0 ? _a : {};
};
exports.getUserConfig = getUserConfig;
const loadPlugin = () => {
    return require((0, path_1.resolve)(getCwd(), 'plugin'));
};
exports.loadPlugin = loadPlugin;
const readAsyncChunk = async () => {
    const cwd = getCwd();
    try {
        const str = (await fs_1.promises.readFile((0, path_1.resolve)(cwd, './.aora/asyncChunkMap.json'))).toString();
        return JSON.parse(str);
    }
    catch (error) {
        return {};
    }
};
exports.readAsyncChunk = readAsyncChunk;
const addAsyncChunk = async (dynamicCssOrder, webpackChunkName) => {
    const arr = [];
    const asyncChunkMap = await readAsyncChunk();
    for (const key in asyncChunkMap) {
        if (asyncChunkMap[key].includes(webpackChunkName)) {
            arr.push(`${key}.css`);
        }
    }
    return arr.concat(dynamicCssOrder);
};
exports.addAsyncChunk = addAsyncChunk;
const cyrb53 = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
const cryptoAsyncChunkName = (chunks, asyncChunkMap) => {
    // 加密异步模块 name，防止名称过长
    const allChunksNames = chunks.map((item) => item.name).join('~');
    const allChunksNamesArr = allChunksNames.split('~');
    const cryptoAllChunksNames = String(cyrb53(allChunksNames));
    if (allChunksNamesArr.length >= 2 && !asyncChunkMap[cryptoAllChunksNames]) {
        asyncChunkMap[cryptoAllChunksNames] = allChunksNamesArr;
    }
    return cryptoAllChunksNames;
};
exports.cryptoAsyncChunkName = cryptoAsyncChunkName;
const getLocalNodeModules = () => (0, path_1.resolve)(__dirname, '../../../node_modules');
exports.getLocalNodeModules = getLocalNodeModules;
const processError = (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
};
exports.processError = processError;
const accessFile = async (file) => {
    const result = await fs_1.promises.access(file)
        .then(() => true)
        .catch(() => false);
    return result;
};
exports.accessFile = accessFile;
const copyReactContext = async () => {
    await fs_1.promises.copyFile((0, path_1.resolve)(__dirname, '../../context.ts'), (0, path_1.resolve)(getCwd(), './.aora/create-context.ts'));
};
exports.copyReactContext = copyReactContext;
const execPromisify = (0, util_1.promisify)(child_process_1.exec);
exports.execPromisify = execPromisify;
const normalizeStartPath = (path) => {
    if (path.startsWith('//')) {
        path = path.replace('//', '/');
    }
    if (!path.startsWith('/')) {
        path = `/${path}`;
    }
    return path;
};
exports.normalizeStartPath = normalizeStartPath;
const normalizeEndPath = (path) => {
    if (!path.endsWith('/')) {
        path = `${path}/`;
    }
    return path;
};
exports.normalizeEndPath = normalizeEndPath;
