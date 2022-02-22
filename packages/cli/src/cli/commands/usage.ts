import { defineAoraCommand } from './index';

export default defineAoraCommand({
  meta: {
    name: 'usage',
    usage: 'npx aora usage',
    description: 'Run aora usage',
  },
  async invoke(args) {
    console.log(args);
  },
});
