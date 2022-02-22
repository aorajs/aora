import { defineAoraCommand } from './index';

export default defineAoraCommand({
  meta: {
    name: 'prepare',
    usage: 'npx aora prepare',
    description: 'Run aora prepare',
  },
  async invoke(args) {
    console.log(args);
  },
});
