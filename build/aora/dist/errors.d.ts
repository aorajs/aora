import type { AppData } from './data';
export interface AppState {
    error?: SerializedError;
    catch?: ThrownResponse;
    catchBoundaryRouteId: string | null;
    loaderBoundaryRouteId: string | null;
    renderBoundaryRouteId: string | null;
    trackBoundaries: boolean;
    trackCatchBoundaries: boolean;
}
export interface ThrownResponse<Status extends number = number, Data = AppData> {
    status: Status;
    statusText: string;
    data: Data;
}
export interface SerializedError {
    message: string;
    stack?: string;
}
//# sourceMappingURL=errors.d.ts.map