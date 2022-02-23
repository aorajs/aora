import { ReactChild } from 'react';

type IProps<T = {}> = T & {
  children: ReactChild;
};

type SProps<T = {}> = T & any;

interface Action {
  type: string;
  payload: object;
}

export type { IProps, Action, SProps };
