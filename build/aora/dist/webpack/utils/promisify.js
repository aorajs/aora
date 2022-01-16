"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpackPromisify = void 0;
const util_1 = require("util");
const webpack_1 = __importDefault(require("webpack"));
const webpackPromisify = (0, util_1.promisify)(webpack_1.default);
exports.webpackPromisify = webpackPromisify;
