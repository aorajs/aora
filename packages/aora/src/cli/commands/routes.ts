import { readConfig } from "@aora/cli";
import { formatRoutes } from '../../utils';
import { defineAoraCommand } from './index';

export default defineAoraCommand({
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
});
