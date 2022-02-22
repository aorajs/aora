import { defineAoraCommand } from './index';

export default defineAoraCommand({
  meta: {
    name: 'info',
    usage: 'npx aora info',
    description: 'Run aora info',
  },
  async invoke(args) {
    console.log(args);
  },
});
