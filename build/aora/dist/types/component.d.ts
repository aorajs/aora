import { ReactChild } from 'react';
declare type IProps<T = {}> = T & {
    children: ReactChild;
};
declare type SProps<T = {}> = T & any;
interface Action {
    type: string;
    payload: object;
}
export { IProps, Action, SProps };
//# sourceMappingURL=component.d.ts.map