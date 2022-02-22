import { defineAoraCommand } from './index';

export default defineAoraCommand({
  meta: {
    name: 'init',
    usage: 'npx aora init',
    description: 'Run aora init',
  },
  async invoke(args) {
    console.log(args);
  },
});
