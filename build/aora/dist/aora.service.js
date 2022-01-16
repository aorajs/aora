"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoraRenderService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const render_1 = require("./render");
const index_1 = require("./index");
const path_1 = require("path");
const fs_1 = require("fs");
const cacache = require('cacache');
const cachePath = (0, path_1.join)((0, index_1.getCwd)(), './.aora/cache');
const crypto = require('crypto');
const md5 = (value) => {
    return crypto.createHash('md5').update(value).digest('hex');
};
let AoraRenderService = class AoraRenderService {
    constructor(request) {
        this.request = request;
        this.response = request.res;
        this.request = request;
        fs_1.promises.mkdir(cachePath, { recursive: true });
    }
    async csr(data, options = {}) {
        return this.render(data, {
            ...options,
            ssr: false
        });
    }
    async ssr(data, options = {}) {
        return this.render(data, {
            ...options,
            ssr: true
        });
    }
    async render(data, options = {}) {
        var _a;
        try {
            const { cache = false, ...opts } = options;
            let cacheData;
            let cacheKey;
            if (cache && (cacheKey = md5(this.request.url))) {
                try {
                    cacheData = await ((_a = cacache.get(cachePath, cacheKey)) === null || _a === void 0 ? void 0 : _a.data);
                    if (cacheData) {
                        if (Buffer.isBuffer(cacheData)) {
                            cacheData = cacheData.toString();
                        }
                        if (cacheData)
                            return cacheData;
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            const ctx = {
                request: this.request,
                response: this.response,
                data: data,
            };
            const res = await (0, render_1.render)(ctx, opts);
            if (cache) {
                cacache.put(cachePath, cacheKey, res);
            }
            return res;
        }
        catch (error) {
            console.log(error);
            this.response.status(500).send(error);
        }
    }
};
AoraRenderService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST))
], AoraRenderService);
exports.AoraRenderService = AoraRenderService;
