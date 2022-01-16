import { ReactElement } from 'react';
import type { Location } from 'history';
import type { Navigator } from 'react-router';
import { Action } from 'history';
interface AoraEntryContextType extends Record<string, any> {
}
export declare function useAoraEntryContext(): AoraEntryContextType;
export declare function AoraEntry({ location: historyLocation, base: base, navigator: _navigator, context: context, static: staticProp, action, children, }: {
    location: Location;
    base: string;
    context: any;
    navigator: Navigator;
    action: Action;
    static?: boolean;
    children: ReactElement | ReactElement[];
}): ReactElement;
export {};
//# sourceMappingURL=components.d.ts.map