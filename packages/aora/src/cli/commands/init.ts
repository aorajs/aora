import { AoraCommand } from './command';

const aoraInit: AoraCommand = {
  meta: {
    name: 'init',
    usage: 'npx aora init',
    description: 'Run aora init',
  },
  async invoke(args) {
    console.log(args);
  },
};

export default aoraInit;
