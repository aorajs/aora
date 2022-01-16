"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServerBuild = void 0;
const config_1 = require("../entity/config");
const promisify_1 = require("./utils/promisify");
const startServerBuild = async (config) => {
    const webpackConfig = (0, config_1.getServerWebpack)(config);
    const { webpackStatsOption } = config;
    const stats = await (0, promisify_1.webpackPromisify)(webpackConfig);
    console.log(stats.toString(webpackStatsOption));
};
exports.startServerBuild = startServerBuild;
