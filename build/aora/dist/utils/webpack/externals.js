"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeExternals = void 0;
// @ts-nocheck
const __1 = require("..");
const external_utils_1 = require("./external-utils");
const scopedModuleRegex = new RegExp('@[a-zA-Z0-9][\\w-.]+\/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9.\/]+)?', 'g');
function getModuleName(request, includeAbsolutePaths) {
    let req = request;
    const delimiter = '/';
    if (includeAbsolutePaths) {
        req = req.replace(/^.*?\/node_modules\//, '');
    }
    // check if scoped module
    if (scopedModuleRegex.test(req)) {
        // reset regexp
        scopedModuleRegex.lastIndex = 0;
        return req.split(delimiter, 2).join(delimiter);
    }
    return req.split(delimiter)[0];
}
function nodeExternals(options) {
    options = options || {};
    const whitelist = (0, __1.uniqueWhitelist)([].concat(options.whitelist || []));
    const binaryDirs = [].concat(options.binaryDirs || ['.bin']);
    const importType = options.importType || 'commonjs';
    const modulesDir = options.modulesDir || 'node_modules';
    const modulesFromFile = !!options.modulesFromFile;
    const includeAbsolutePaths = !!options.includeAbsolutePaths;
    // helper function
    function isNotBinary(x) {
        return !(0, external_utils_1.contains)(binaryDirs, x);
    }
    // create the node modules list
    let nodeModules = [];
    if (modulesFromFile) {
        nodeModules = (0, external_utils_1.readFromPackageJson)(options.modulesFromFile);
    }
    else {
        if (Array.isArray(modulesDir)) {
            modulesDir.map(str => {
                nodeModules = nodeModules.concat((0, external_utils_1.readDir)(str).filter(isNotBinary));
            });
        }
        else {
            nodeModules = (0, external_utils_1.readDir)(modulesDir).filter(isNotBinary);
        }
    }
    // return an externals function
    return function (context, request, callback) {
        const moduleName = getModuleName(request, includeAbsolutePaths);
        if ((0, external_utils_1.contains)(nodeModules, moduleName) && !(0, external_utils_1.containsPattern)(whitelist, request)) {
            if (typeof importType === 'function') {
                return callback(null, importType(request));
            }
            // mark this module as external
            // https://webpack.js.org/configuration/externals/
            return callback(null, importType + ' ' + request);
        }
        callback();
    };
}
exports.nodeExternals = nodeExternals;
