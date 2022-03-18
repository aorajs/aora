import type { Configuration } from 'webpack';
import * as webpack from 'webpack';

export function webpackCompiler(webpackConfig: Configuration) {
  return new Promise<void>((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      console.log(err);
      if (err || stats?.hasErrors()) {
        if (err) {
          reject(err);
        } else if (stats) {
          const errMsg = stats.toString();
          console.error(errMsg);
          reject(new Error(errMsg));
        }
      }
      resolve();
    });
  });
}
