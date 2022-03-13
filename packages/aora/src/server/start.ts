import {IConfig} from '@aora/types';
import {exec} from 'child_process';
import type {ChildProcess} from 'child_process'

export const start = (_config: IConfig) => {
  return new Promise<void>((resolve, reject) => {
    let childProcessRef: ChildProcess | undefined
    childProcessRef = exec('npx nest start --watch', {
      env: {...process.env, FORCE_COLOR: '1'},
    });
    childProcessRef?.on('exit', (code) => {
      if (code && code !== 0) {
        process.exitCode = code;
      }
      childProcessRef = undefined
    })
    childProcessRef?.stdout?.on('data', function (data) {
      if (data.match('Nest application successfully started')) {
        resolve();
      }
      console.log(data)
    });
    childProcessRef.stderr?.on('data', function (err) {
      console.error(`error: ${err}`);
      reject(new Error(err));
    });
  });
};
