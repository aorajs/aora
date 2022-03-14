import {AoraCommand} from './command';

const aoraUsage: AoraCommand = {
  meta: {
    name: 'usage',
    usage: 'npx aora usage',
    description: 'Run aora usage',
  },
  async invoke(args) {
    console.log(args);
  },
}

export default aoraUsage
