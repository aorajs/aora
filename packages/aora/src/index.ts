export {STORE_CONTEXT} from './client/context';
export * from './defineConfig';
export * from './types';
export * from './utils';
import { createServer } from './aora';
export type { AoraServer } from './aora.server'

export default createServer
