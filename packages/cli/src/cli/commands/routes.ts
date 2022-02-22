// import { formatRoutes } from '../../utils';
import { readConfig } from '../../config';
import { defineAoraCommand } from './index';

export default defineAoraCommand({
  meta: {
    name: 'routes',
    usage: 'npx aora routes',
    description: 'Run aora generate routes',
  },
  async invoke(args) {
    const config = await readConfig();
    console.log('config', config, args);
    // const routes = formatRoutes(config, args.jsx ? 'jsx' : 'json');
    // console.log(routes);
  },
});
