import { Configuration, RuleSetCondition } from 'webpack';
import * as Config from 'webpack-5-chain';
import { Argv } from './yargs';

export type Script = Array<{
  describe:
    | object
    | {
    attrs: object;
  };
  content: string;
}>;

export interface IConfig {
  cwd: string;
  isDev: boolean;
  publicPath: string;
  useHash: boolean;
  host: string;
  fePort: number;
  chunkName: string;
  getOutput: () => {
    clientOutPut: string;
    serverOutPut: string;
  };
  proxy?: any;
  cssOrder: string[];
  jsOrder: string[];
  extraJsOrder?: string[];
  extraCssOrder?: string[];
  css?: () => {
    loaderOptions?: {
      cssOptions?: any;
      less?: any;
      sass?: any;
      postcss?: {
        options: any;
        plugins: any[];
      };
    };
  };
  chainBaseConfig: (config: Config) => Configuration;
  chainServerConfig: (config: Config) => Configuration;
  chainClientConfig: (config: Config) => Configuration;
  moduleFileExtensions: string[];
  whiteList: RegExp[];
  prefix?: string;
  dynamic: boolean;
  ssr: boolean;
  webpackDevServerConfig?: any;
  stream: boolean;
  locale?: {
    enable: false;
  };
  corejs: boolean;
  https: boolean | object;
  babelExtraModule?: RuleSetCondition;
  routerPriority?: Record<string, number>;
  routerOptimize?: {
    include?: string[];
    exclude?: string[];
  };
  parallelFetch?: boolean;
  nestStartTips?: string;
  disableClientRender?: boolean;
  manifestPath: string;
  proxyKey: string[];
}

type Optional<T> = { [key in keyof T]?: T[key] };

export interface proxyOptions {
  express?: boolean;
}

export type UserConfig = Optional<IConfig>;

export interface StyleOptions {
  rule: string;
  include?: RegExp | RegExp[];
  exclude?: RegExp | RegExp[];
  loader?: string;
  importLoaders: number;
  isServer: boolean;
}

export interface IPlugin {
  clientPlugin?: {
    name: string;
    start?: (argv?: Argv) => void;
    build?: (argv?: Argv) => void;
  };
  serverPlugin?: {
    name: string;
    start?: (argv?: Argv) => void;
    build?: (argv?: Argv) => void;
  };
}
