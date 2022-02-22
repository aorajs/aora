/* utils */
export * from './cwd';
export * from './findRoute';
export * from './loadConfig';
export * from './manifest';
export * from './middlewares';
export * from './parse';
export * from './string-stream';
export * from './webpack';

export const isFunction = (o: unknown) =>
  Object.prototype.toString.call(o) === '[object Function]';
