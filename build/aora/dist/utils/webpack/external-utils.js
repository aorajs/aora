"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contains = exports.containsPattern = exports.readDir = exports.readFromPackageJson = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cwd_1 = require("../cwd");
const contains = function contains(arr, val) {
    return arr && arr.indexOf(val) !== -1;
};
exports.contains = contains;
const atPrefix = new RegExp('^@', 'g');
const readDir = function readDir(dirName) {
    if (!fs_1.default.existsSync(dirName)) {
        return [];
    }
    try {
        return fs_1.default.readdirSync(dirName).map(function (module) {
            if (atPrefix.test(module)) {
                // reset regexp
                atPrefix.lastIndex = 0;
                try {
                    return fs_1.default.readdirSync(path_1.default.join(dirName, module)).map(function (scopedMod) {
                        return module + '/' + scopedMod;
                    });
                }
                catch (e) {
                    return [module];
                }
            }
            return module;
        }).reduce(function (prev, next) {
            return prev.concat(next);
        }, []);
    }
    catch (e) {
        return [];
    }
};
exports.readDir = readDir;
const readFromPackageJson = function readFromPackageJson(options) {
    if (typeof options !== 'object') {
        options = {};
    }
    // read the file
    let packageJson;
    try {
        const fileName = options.fileName || 'package.json';
        const packageJsonString = fs_1.default.readFileSync(path_1.default.join((0, cwd_1.getCwd)(), './' + fileName), 'utf8');
        packageJson = JSON.parse(packageJsonString);
    }
    catch (e) {
        return [];
    }
    // sections to search in package.json
    let sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    if (options.include) {
        sections = [].concat(options.include);
    }
    if (options.exclude) {
        sections = sections.filter(function (section) {
            return ![].concat(options.exclude).includes(section);
        });
    }
    // collect dependencies
    const deps = {};
    sections.forEach(function (section) {
        Object.keys(packageJson[section] || {}).forEach(function (dep) {
            deps[dep] = true;
        });
    });
    return Object.keys(deps);
};
exports.readFromPackageJson = readFromPackageJson;
const containsPattern = function containsPattern(arr, val) {
    return arr && arr.some(function (pattern) {
        if (pattern instanceof RegExp) {
            return pattern.test(val);
        }
        else if (typeof pattern === 'function') {
            return pattern(val);
        }
        else {
            return pattern === val;
        }
    });
};
exports.containsPattern = containsPattern;
