#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const child_process_1 = require("child_process");
const yargs_1 = __importDefault(require("yargs"));
const preprocess_1 = require("./preprocess");
const config_1 = require("../entity/config");
const spinnerProcess = (0, child_process_1.fork)((0, path_1.resolve)(__dirname, './spinner')); // 单独创建子进程跑 spinner 否则会被后续的 同步代码 block 导致 loading 暂停
const spinner = {
    start: () => spinnerProcess.send({
        message: 'start'
    }),
    stop: () => spinnerProcess.send({
        message: 'stop'
    })
};
yargs_1.default
    .version(false)
    .command('start', 'Start Server', {}, async (argv) => {
    spinner.start();
    const config = await (0, preprocess_1.transformConfig)();
    await (0, preprocess_1.handleEnv)(argv, spinner, config.https);
    const aora = new config_1.Aora(config);
    await aora.parseRoutes();
    spinner.stop();
    await aora.startClient();
    // await aora.clean()
    await aora.startServer();
    await aora.setupBuildId();
})
    .command('build', 'Build server and client files', {}, async () => {
    spinner.start();
    process.env.NODE_ENV = 'production';
    const config = await (0, preprocess_1.transformConfig)();
    const aora = new config_1.Aora(config);
    await aora.parseRoutes();
    spinner.stop();
    await aora.buildClient();
    // await aora.clean()
    await aora.buildServer();
    await aora.setupBuildId();
})
    .demandCommand(1, 'You need at least one command before moving on')
    .fail((msg, err) => {
    if (err) {
        console.log(err);
        spinner.stop();
        process.exit(1);
    }
    console.log(msg);
})
    .parse();
