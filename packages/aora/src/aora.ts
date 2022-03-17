import { AoraServer } from './aora.server';

export function createServer(options: any): Promise<AoraServer> {
  const server = new AoraServer(options);
  return Promise.resolve(server);
}
