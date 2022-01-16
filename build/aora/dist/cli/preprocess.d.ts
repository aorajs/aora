export interface ResolveModuleOptions {
    paths?: string | string[];
}
export interface RequireModuleOptions extends ResolveModuleOptions {
    /** Clear the require cache (force fresh require) but only if not within `node_modules` */
    clearCache?: boolean;
    /** Automatically de-default the result of requiring the module. */
    interopDefault?: boolean;
}
export declare function isNodeModules(id: string): boolean;
export declare const handleEnv: (_argv: Argv, _spinner: any, https: IConfig) => Promise<void>;
export declare const transformConfig: () => Promise<IConfig>;
//# sourceMappingURL=preprocess.d.ts.map