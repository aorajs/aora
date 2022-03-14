import { IConfig } from '@aora/types';
import { execSync } from 'child_process';

export const build = (_config: IConfig) => {
  execSync('npx nest build');
};
