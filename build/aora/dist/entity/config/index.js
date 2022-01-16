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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aora = void 0;
const clean_1 = require("../../cli/clean");
const fs_1 = require("fs");
const __1 = require("../..");
const path_1 = require("path");
__exportStar(require("./client"), exports);
__exportStar(require("./server"), exports);
class Aora {
    constructor(config) {
        this.config = config;
        //
    }
    async startServer() {
        const { start: server } = await Promise.resolve().then(() => __importStar(require('../../server/start')));
        await server(this.config);
    }
    async startClient() {
        const { start: client } = await Promise.resolve().then(() => __importStar(require('..')));
        await client(this.config);
    }
    async buildServer() {
        const { build: server } = await Promise.resolve().then(() => __importStar(require('../../server/build')));
        await server(this.config);
    }
    async parseRoutes() {
        const { parseFeRoutes } = await Promise.resolve().then(() => __importStar(require('../../utils/parse')));
        await parseFeRoutes(this.config);
    }
    async buildClient() {
        const { build: client } = await Promise.resolve().then(() => __importStar(require('..')));
        await client(this.config);
    }
    async clean() {
        await (0, clean_1.cleanOutDir)();
    }
    async setupBuildId() {
        await fs_1.promises.writeFile((0, path_1.join)((0, __1.getCwd)(), './.aora/BUILD_ID'), Date.now().toString());
    }
}
exports.Aora = Aora;
