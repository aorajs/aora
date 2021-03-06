export * from './component';
export * from './config';
export * from './ctx';
export * from './route';
export * from './yargs';
import type { ReactChild } from 'react';
import * as React from 'react';

export type Mode = 'development' | 'production';

export type ESMFeRouteItem<T = {}> = {
  path: string;
  webpackChunkName: string;
} & T;

export interface ParseFeRouteItem {
  path: string;
  fetch?: string;
  component?: string;
  webpackChunkName: string;
}

export type IProps<T = {}> = T & {
  children: ReactChild;
};

export type SProps<T = {}> = T & any;

export interface Action {
  type: string;
  payload: object;
}

export interface IContext<T = any> {
  state?: T;
  dispatch?: React.Dispatch<Action>;
}
