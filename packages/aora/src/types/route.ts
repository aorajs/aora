// import { RouteComponentProps } from 'react-router-dom'
import { IConfig } from './config';
import { ISSRContext } from './ctx';

export interface LayoutProps {
  ctx?: ISSRContext;
  config?: IConfig;
  children?: JSX.Element;
  staticList?: StaticList;
  injectState?: any;
  state?: any;
}

export interface StaticList {
  injectCss: JSX.Element[];
  injectScript: JSX.Element[];
}

export interface ProvisionalFeRouteItem {
  path?: string;
  layout: string;
  fetch?: string;
  component?: string;
}

export interface Params<T> {
  ctx?: ISSRContext<T>;
  routerProps?: any;
  data?: any;
  state?: any;
}

export type ReactFetch<T = {}> = (params: Params<T>) => Promise<any>;

export type ReactESMFetch = () => Promise<{
  default: ReactFetch;
}>;

export type ESMLayout = () => Promise<React.FC<LayoutProps>>;

export interface StaticFC<T = {}> extends React.FC<T> {
  fetch?: ReactESMFetch;
  layoutFetch?: ReactFetch;
}

export interface DynamicFC<T = {}> extends React.FC<T> {
  name: 'dynamicComponent';
  fetch?: ReactESMFetch;
  layoutFetch?: ReactFetch;

  (): Promise<{
    default: StaticFC<T>;
    fetch?: ReactESMFetch;
  }>;
}

export type ReactESMFeRouteItem<T = {}, U = {}> = {
  path: string;
  fetch?: ReactESMFetch;
  component: DynamicFC<T>;
  webpackChunkName: string;
} & U;

export interface ReactRoutesType {
  Layout: React.FC<LayoutProps>;
  App?: React.FC;
  layoutFetch: ReactFetch;
  FeRoutes: ReactESMFeRouteItem[];
  PrefixRouterBase?: string;
  state?: any;
  reducer?: any;
}
