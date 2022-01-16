import type { ReactElement } from 'react';
export interface AoraServerProps {
    context: any;
    url: string | URL;
    base: string;
    children: ReactElement | ReactElement[];
}
export declare function AoraServer({ context, url, children }: AoraServerProps): ReactElement;
//# sourceMappingURL=server.d.ts.map