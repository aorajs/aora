import { uniqueWhitelist } from '..';
import { contains, containsPattern, readDir, readFromPackageJson } from './external-utils';

const scopedModuleRegex = new RegExp(
  '@[a-zA-Z0-9][\\w-.]+/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9./]+)?',
  'g',
);

function getModuleName(
  request: string | undefined,
  includeAbsolutePaths: boolean,
) {
  let req = request;
  const delimiter = '/';

  if (includeAbsolutePaths) {
    req = req?.replace(/^.*?\/node_modules\//, '');
  }
  // check if scoped module
  if (req && scopedModuleRegex.test(req)) {
    // reset regexp
    scopedModuleRegex.lastIndex = 0;
    return req.split(delimiter, 2).join(delimiter);
  }
  return req?.split(delimiter)[0];
}

function nodeExternals(options: {
  whitelist?: (string | RegExp)[];
  modulesDir?: any;
  binaryDirs?: any;
  importType?: any;
  modulesFromFile?: any;
  includeAbsolutePaths?: any;
}) {
  options = options || {};
  const whitelist = uniqueWhitelist([...(options.whitelist || [])]);
  const binaryDirs: (string | RegExp)[] = [].concat(
    options.binaryDirs || ['.bin'],
  );
  const importType = options.importType || 'commonjs';
  const modulesDir = options.modulesDir || 'node_modules';
  const modulesFromFile = !!options.modulesFromFile;
  const includeAbsolutePaths = !!options.includeAbsolutePaths;

  // helper function
  function isNotBinary(x: string | RegExp) {
    return !contains(binaryDirs, x);
  }

  // create the node modules list
  let nodeModules: any[] = [];
  if (modulesFromFile) {
    nodeModules = readFromPackageJson(options.modulesFromFile);
  } else {
    if (Array.isArray(modulesDir)) {
      modulesDir.map((str) => {
        nodeModules = nodeModules.concat(readDir(str).filter(isNotBinary));
      });
    } else {
      nodeModules = readDir(modulesDir).filter(isNotBinary);
    }
  }

  // return an externals function
  return function(context: any, callback: any) {
    const { request } = context;
    const moduleName = getModuleName(request, includeAbsolutePaths);
    if (
      contains(nodeModules, moduleName) &&
      !containsPattern(whitelist, request)
    ) {
      if (typeof importType === 'function') {
        return callback(undefined, importType(request));
      }
      // mark this module as external
      // https://webpack.js.org/configuration/externals/
      return callback(undefined, importType + ' ' + request);
    }
    callback();
  };
}

export { nodeExternals };
