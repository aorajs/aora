export interface ResolveModuleOptions {
  paths?: string | string[];
}

export interface RequireModuleOptions extends ResolveModuleOptions {
  // TODO: use create-require for jest environment
  // native?: boolean
  /** Clear the require cache (force fresh require) but only if not within `node_modules` */
  clearCache?: boolean;

  /** Automatically de-default the result of requiring the module. */
  interopDefault?: boolean;
}

export function isNodeModules(id: string) {
  // TODO: Follow symlinks
  return /[/\\]node_modules[/\\]/.test(id);
}
