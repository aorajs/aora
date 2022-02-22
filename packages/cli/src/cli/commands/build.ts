// import { Aora } from '../../entity/config';
// import { transformConfig } from '../preprocess';
import { readConfig } from "../../config";
import { defineAoraCommand } from './index';

export default defineAoraCommand({
  meta: {
    name: 'build',
    usage: 'npx aora build',
    description: 'Run aora build',
  },
  async invoke() {
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
    const config = await readConfig();
    console.log('config', config)
    // const aora = new Aora(config);
    // await aora.parseRoutes();
    // await aora.buildClient();
    // // await aora.clean()
    // await aora.buildServer();
    // await aora.setupBuildId();
  },
});
