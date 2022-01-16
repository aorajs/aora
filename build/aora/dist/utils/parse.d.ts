export declare const normalizePath: (config: IConfig, path: string, base?: string | undefined) => string;
export declare const normalizePublicPath: (path: string) => string;
export declare const getOutputPublicPath: (publicPath: string, isDev: boolean) => string;
export declare const getImageOutputPath: (publicPath: string, isDev: boolean) => {
    publicPath: string;
    imagePath: string;
};
declare const parseFeRoutes: (config: IConfig) => Promise<void>;
export { parseFeRoutes };
//# sourceMappingURL=parse.d.ts.map