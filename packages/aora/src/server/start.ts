import { IConfig } from '@aora/types';
import { exec } from 'child_process';

export const start = (_config: IConfig) => {
  return new Promise<void>((resolve, reject) => {
    const { stdout, stderr } = exec('npx nest start --watch', {
      env: { ...process.env, FORCE_COLOR: '1' },
    });
    stdout?.on('data', function (data) {
      console.log(data);
      if (data.match('Nest application successfully started')) {
        resolve();
      }
    });
    stderr?.on('data', function (data) {
      console.error(`error: ${data}`);
      reject(data);
    });
  });
};
