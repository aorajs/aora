"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManifest = void 0;
const path_1 = require("path");
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const cwd_1 = require("./cwd");
// 创建一个实例来请求，防止业务代码的 axios 设置了 defaults 配置导致获取 manifest 失败
const instance = axios_1.default.create({
    timeout: 3000,
    proxy: false
});
const _getManiFest = async (config) => {
    const { isDev, fePort, https, manifestPath } = config;
    let manifest = {};
    const cwd = (0, cwd_1.getCwd)();
    if (isDev) {
        const res = await instance.get(`${https ? 'https' : 'http'}://localhost:${fePort}${manifestPath}`);
        manifest = res.data;
    }
    else {
        manifest = JSON.parse(await fs_1.promises.readFile((0, path_1.join)(cwd, "./public/_aora/asset-manifest.json"), {
            encoding: "utf-8",
        }));
    }
    return manifest;
};
const getManifest = async (config) => {
    return await _getManiFest(config);
};
exports.getManifest = getManifest;
