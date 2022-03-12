import { IConfig } from '@aora/types';
import { exec } from 'child_process';
import {getCwd} from "../utils";
import { join} from "path";

export const start = (_config: IConfig) => {
  return new Promise<void>((resolve, reject) => {
    // try {
    //   require(join(getCwd(), './src/main.ts'))
    //   resolve()
    // } catch (e) {
    //   reject(e)
    // }
    // const { stdout, stderr } = exec('npx nest start --watch', {
    //   env: { ...process.env, FORCE_COLOR: '1' },
    // });
    // stdout?.on('data', function (data) {
    //   console.log(data);
    //   if (data.match('Nest application successfully started')) {
    //     resolve();
    //   }
    // });
    // stderr?.on('data', function (data) {
    //   console.error(`error: ${data}`);
    //   reject(data);
    // });
  });
};
