import type {AnyFlags, Result} from 'meow';

export interface AoraCommandMeta {
  name: string;
  usage: string;
  description: string;

  [key: string]: any;
}

export interface AoraCommand {
  meta: AoraCommandMeta;

  invoke(args: Result<AnyFlags>['flags']): Promise<void>;
}

function _rDefault(r: any) {
  return r.default || r;
}

export const commands = {
  dev: () => import('./dev').then(_rDefault),
  build: () => import('./build').then(_rDefault),
  analyze: () => import('./analyze').then(_rDefault),
  usage: () => import('./usage').then(_rDefault),
  info: () => import('./info').then(_rDefault),
  init: () => import('./init').then(_rDefault),
  routes: () => import('./routes').then(_rDefault),
  create: () => import('./init').then(_rDefault),
  start: () => import('./start').then(_rDefault),
};

export type Command = keyof typeof commands;
