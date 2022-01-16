"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const spinner = (0, ora_1.default)('正在构建');
process.on('message', (data) => {
    const { message } = data;
    if (message === 'start') {
        spinner.start();
    }
    else {
        spinner.stop();
        process.exit();
    }
});
