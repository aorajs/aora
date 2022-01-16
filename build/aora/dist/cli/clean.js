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
exports.cleanOutDir = void 0;
const path_1 = require("path");
const shelljs_1 = require("shelljs");
const cleanOutDir = async () => {
    // 默认清理 dist 文件夹
    const { accessFile, getCwd } = await Promise.resolve().then(() => __importStar(require('../utils')));
    const cwd = getCwd();
    const tsconfigExist = await accessFile((0, path_1.resolve)(cwd, './tsconfig.json'));
    if (tsconfigExist && process.env.CLEAN !== 'false') {
        try {
            const outDir = require((0, path_1.resolve)(cwd, './tsconfig.json')).compilerOptions.outDir;
            (0, shelljs_1.rm)('-rf', (0, path_1.resolve)(cwd, outDir));
        }
        catch (error) {
            // 有可能 json 文件存在注释导致 require 失败，这里 catch 一下
            console.log('检测到当前目录 tsconfig.json 文件可能存在语法错误');
        }
    }
};
exports.cleanOutDir = cleanOutDir;
