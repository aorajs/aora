import { readConfig } from '@aora/cli';
import { startAoraServer } from '@aora/server';
import { join } from 'path';
import { AoraCommand } from './command';

const aoraStart: AoraCommand = {
  meta: {
    name: 'start',
    usage: 'npx aora start',
    description: 'Run aora production start',
  },
  async invoke() {
    process.env.NODE_ENV = 'production';
    try {
      const config = await readConfig();
      const execFile = require.resolve(join(process.cwd(), './dist/main.js'));
      const { default: createApp } = await import(execFile);
      const app =
        createApp instanceof Function ? await createApp() : await createApp;
      await startAoraServer(app, config);
      // require(execFile);
      app.lis;
    } catch (e) {
      console.log('Aora error', e);
    }
  },
};

export default aoraStart;
