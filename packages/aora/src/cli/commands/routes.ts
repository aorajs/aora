import { readConfig } from '@aora/cli';
import { formatRoutes } from '../../utils';
import { AoraCommand } from './command';

const aoraRoutes: AoraCommand = {
  meta: {
    name: 'routes',
    usage: 'npx aora routes',
    description: 'Run aora generate routes',
  },
  async invoke(args) {
    const config = await readConfig();
    const routes = formatRoutes(config, args.jsx ? 'jsx' : 'json');
    console.log(routes);
  },
};

export default aoraRoutes;
