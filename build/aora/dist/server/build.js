"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const child_process_1 = require("child_process");
const ora_1 = __importDefault(require("ora"));
const spinner = (0, ora_1.default)('正在构建');
const build = (_config) => {
    return new Promise((resolve) => {
        spinner.start();
        (0, child_process_1.exec)('npx nest build', () => {
            spinner.stop();
            resolve();
        });
    });
};
exports.build = build;
