import React from 'react';
import type { Location } from 'history';
import { ThrownResponse } from './errors';
import { CatchBoundaryComponent } from './routeModules';
declare type AoraErrorBoundaryProps = React.PropsWithChildren<{
    location: Location;
    error?: Error;
}>;
declare type AoraErrorBoundaryState = {
    error: null | Error;
    location: Location;
};
export declare class AoraErrorBoundary extends React.Component<AoraErrorBoundaryProps, AoraErrorBoundaryState> {
    render(): React.ReactNode;
}
export declare function useCatch<Result extends ThrownResponse = ThrownResponse>(): Result;
declare type AoraCatchBoundaryProps = React.PropsWithChildren<{
    location: Location;
    component: CatchBoundaryComponent;
    catch?: ThrownResponse;
}>;
export declare function AoraCatchBoundary({ catch: catchVal, component: Component, children, }: AoraCatchBoundaryProps): JSX.Element;
/**
 * When app's don't provide a root level CatchBoundary, we default to this.
 */
export declare function AoraRootDefaultCatchBoundary(): JSX.Element;
export {};
//# sourceMappingURL=errorBoundaries.d.ts.map