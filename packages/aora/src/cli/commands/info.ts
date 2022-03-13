import {AoraCommand} from './index';

const aoraInfo: AoraCommand = {
  meta: {
    name: 'info',
    usage: 'npx aora info',
    description: 'Run aora info',
  },
  async invoke(args) {
    console.log(args);
  },
};

export default aoraInfo
