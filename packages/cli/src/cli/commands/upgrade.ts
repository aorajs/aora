import { defineAoraCommand } from './index';

export default defineAoraCommand({
  meta: {
    name: 'upgrade',
    usage: 'npx aora upgrade',
    description: 'Run aora upgrade',
  },
  async invoke(args) {
    console.log(args);
  },
});
