"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformConfig = exports.handleEnv = exports.isNodeModules = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const esbuild_1 = require("esbuild");
const __1 = require("..");
function isNodeModules(id) {
    // TODO: Follow symlinks
    return /[/\\]node_modules[/\\]/.test(id);
}
exports.isNodeModules = isNodeModules;
const handleEnv = async (_argv, _spinner, https) => {
    process.env.BUILD_TOOL = 'webpack';
    process.env.NODE_ENV = 'development';
    if (https) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
};
exports.handleEnv = handleEnv;
const transformConfig = async () => {
    const { accessFile, getCwd } = await Promise.resolve().then(() => __importStar(require('../utils')));
    const cwd = getCwd();
    if (!await accessFile((0, path_1.join)(cwd, './aora'))) {
        await fs_1.promises.mkdir((0, path_1.join)(cwd, './.aora'), { recursive: true });
    }
    const configWithTs = await accessFile((0, path_1.join)(cwd, './.aorarc.ts'));
    if (configWithTs) {
        const fileContent = (await fs_1.promises.readFile((0, path_1.join)(cwd, './.aorarc.ts'))).toString();
        const { code } = await (0, esbuild_1.transform)(fileContent, {
            loader: 'ts',
            format: 'cjs',
            charset: 'utf8',
        });
        await fs_1.promises.writeFile((0, path_1.join)(cwd, './.aora/.aorarc.js'), code);
    }
    await fs_1.promises.mkdir((0, path_1.join)(cwd, '.aora/client'), { recursive: true });
    // await fsp.link(join(cwd, '.aora/client'), join(cwd, 'public/_aora'))
    return (0, __1.loadConfig)();
};
exports.transformConfig = transformConfig;
