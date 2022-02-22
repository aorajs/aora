import { readConfig } from '@aora/cli';
import { Aora } from '../../entity/config';
import { defineAoraCommand } from './index';

export default defineAoraCommand({
  meta: {
    name: 'analyze',
    usage: 'npx aora analyze',
    description: 'Run aora analyze',
  },
  async invoke() {
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
    const config = await readConfig();
    const aora = new Aora(config);
    await aora.parseRoutes();
    await aora.buildClient();
    // await aora.clean()
    await aora.buildServer();
    await aora.setupBuildId();
  },
});
