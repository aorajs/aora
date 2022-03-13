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
