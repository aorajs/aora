import { Aora } from '../../entity/config';
import { defineAoraCommand } from './index';
import {readConfig} from "@aora/cli";

export default defineAoraCommand({
  meta: {
    name: 'build',
    usage: 'npx aora build',
    description: 'Run aora build',
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
