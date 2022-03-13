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
