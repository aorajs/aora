import type {AnyFlags, Result} from 'meow';
import {TypedFlags} from "meow";

export interface AoraCommandMeta {
  name: string;
  usage: string;
  description: string;

  [key: string]: any;
}

export interface AoraCommand<T extends TypedFlags<AnyFlags> = TypedFlags<AnyFlags>> {
  meta: AoraCommandMeta;

  invoke(args: Result<AnyFlags>['flags'] & T): Promise<void>;
}
