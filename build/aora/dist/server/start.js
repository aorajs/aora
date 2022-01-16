"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const child_process_1 = require("child_process");
const ora_1 = __importDefault(require("ora"));
const spinner = (0, ora_1.default)('starting');
const start = (_config) => {
    return new Promise((resolve, reject) => {
        spinner.start();
        const { stdout, stderr } = (0, child_process_1.exec)('npx nest start --watch', {
            env: { ...process.env, FORCE_COLOR: '1' }
        });
        stdout === null || stdout === void 0 ? void 0 : stdout.on('data', function (data) {
            console.log(data);
            if (data.match('Nest application successfully started')) {
                spinner.stop();
                resolve();
            }
        });
        stderr === null || stderr === void 0 ? void 0 : stderr.on('data', function (data) {
            console.error(`error: ${data}`);
            reject(data);
        });
    });
};
exports.start = start;
