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
exports.build = exports.start = void 0;
const start = async (config) => {
    // 本地开发的时候要做细致的依赖分离， Vite 场景不需要去加载 Webpack 构建客户端应用所需的模块
    const { startServerBuild, startClientServer } = await Promise.resolve().then(() => __importStar(require('../webpack')));
    await Promise.all([
        startServerBuild(config),
        startClientServer(config),
    ]);
};
exports.start = start;
const build = async (config) => {
    const { startServerBuild, startClientBuild } = await Promise.resolve().then(() => __importStar(require('../webpack')));
    await Promise.all([
        startServerBuild(config),
        startClientBuild(config),
    ]);
};
exports.build = build;
