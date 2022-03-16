import { IConfig } from '@aora/types';
import { promises as fsp } from 'fs';
import { join } from 'path';
import { getCwd } from '../..';
import { cleanOutDir } from '../../cli/clean';
// import { findEntry } from '@aora/react'

export * from './client';
export * from './server';

export class Aora {
  constructor(private config: IConfig) {
    //
  }

  async startServer() {
    const { start: server } = await import('../../server/start');
    await server(this.config);
  }

  async startClient() {
    const { start: client } = await import('../index');
    await client(this.config);
  }

  async buildServer() {
    const { build: server } = await import('../../server/build');
    await server(this.config);
  }

  async parseRoutes() {
    const { parseFeRoutes } = await import('../../utils/parse');
    await parseFeRoutes(this.config);
  }

  async buildClient() {
    const { build: client } = await import('../index');
    await client(this.config);
  }

  async clean() {
    await cleanOutDir();
  }

  async setupBuildId() {
    await fsp.writeFile(
      join(getCwd(), './.aora/BUILD_ID'),
      Math.floor(Math.random() * 100).toString(),
    );
  }
}
