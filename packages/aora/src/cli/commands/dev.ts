import { readConfig } from "@aora/cli";
import { Aora } from '../../entity/config';
import { defineAoraCommand } from './index';

export default defineAoraCommand({
  meta: {
    name: 'dev',
    usage: 'npx aora dev',
    description: 'Run aora development server',
  },
  async invoke() {
    process.env.NODE_ENV = 'development';
    const config = await readConfig();
    const aora = new Aora(config);
    await aora.parseRoutes();
    await aora.startClient();
    await aora.startServer();
    await aora.setupBuildId();
  },
});
