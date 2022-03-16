import {Aora} from '../../entity/config';
import {AoraCommand} from './command';
import {readConfig} from "@aora/cli";

const aoraBuild: AoraCommand<{ analyze: boolean }> = {
  meta: {
    name: 'build',
    usage: 'npx aora build',
    description: 'Run aora build',
  },
  async invoke(flags) {
    console.log(flags.analyze)
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
    const config = await readConfig();
    const aora = new Aora(config);
    await aora.parseRoutes();
    await aora.buildClient();
    await aora.buildServer();
    await aora.setupBuildId();
  },
}

export default aoraBuild
