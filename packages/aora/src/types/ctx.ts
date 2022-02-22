import { Request, Response } from 'express';

export interface ExpressContext {
  request: Request;
  response: Response;
}

export type ISSRContext<T = {}> = ExpressContext & T;

export interface Options {
  ssr?: boolean;
}

declare var window: Window;

// @ts-ignore
export type IWindow = Window & {
  __USE_SSR__?: boolean;
  __INITIAL_DATA__?: any;
  STORE_CONTEXT?: any;
  __disableClientRender__?: boolean;
  prefix?: string;
};

export interface IGlobal {
  window: {
    __USE_SSR__?: IWindow['__USE_SSR__'];
    __INITIAL_DATA__?: IWindow['__INITIAL_DATA__'];
  };
}
