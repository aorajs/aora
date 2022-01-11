export * from './ctx'
export * from './config'
export * from './yargs'
export * from './route'
export * from './component'

export type Mode = 'development' |'production'

export type ESMFeRouteItem<T={}> = {
  path: string
  webpackChunkName: string
} & T

export interface ParseFeRouteItem {
  path: string
  fetch?: string
  component?: string
  webpackChunkName: string
}

import type { ReactChild } from "react";

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
