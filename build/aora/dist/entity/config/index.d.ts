import { IConfig } from 'aora/types';
export * from './client';
export * from './server';
export declare class Aora {
    private config;
    constructor(config: IConfig);
    startServer(): Promise<void>;
    startClient(): Promise<void>;
    buildServer(): Promise<void>;
    parseRoutes(): Promise<void>;
    buildClient(): Promise<void>;
    clean(): Promise<void>;
    setupBuildId(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map