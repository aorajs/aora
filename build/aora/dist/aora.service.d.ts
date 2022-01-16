import type { Request } from 'express';
declare type RenderOptions = Partial<{
    ssr: Boolean;
    stream: Boolean;
    cache: Boolean;
}>;
export declare class AoraRenderService {
    private readonly request;
    private readonly response;
    constructor(request: Request);
    csr(data?: unknown, options?: Exclude<RenderOptions, 'ssr'>): Promise<any>;
    ssr(data?: unknown, options?: Exclude<RenderOptions, 'ssr'>): Promise<any>;
    render(data?: unknown, options?: RenderOptions): Promise<any>;
}
export {};
//# sourceMappingURL=aora.service.d.ts.map