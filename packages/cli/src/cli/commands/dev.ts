// import { Aora } from '../../entity/config';
// import { transformConfig } from '../preprocess';
import { readConfig } from "../../config";
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
    console.log('config', config)
    // const aora = new Aora(config);
    // await aora.parseRoutes();
    // await aora.startClient();
    // await aora.startServer();
    // await aora.setupBuildId();
  },
});
