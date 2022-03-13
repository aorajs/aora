import {Aora} from '../../entity/config';
import {AoraCommand} from './command';
import {readConfig} from "@aora/cli";

const aoraBuild: AoraCommand = {
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
}

export default aoraBuild
