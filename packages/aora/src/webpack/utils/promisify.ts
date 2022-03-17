import type { Configuration } from 'webpack';
import * as webpack from 'webpack';

export function webpackCompiler(webpackConfig: Configuration) {
  return new Promise<void>((resolve, reject) => {
    try {
      const compiler = webpack(webpackConfig);
      compiler.run((err, stats) => {
        if (err || stats?.hasErrors()) {
          if (err) {
            reject(err);
          } else if (stats) {
            const errorMsg = stats.toString('errors-only');
            // console.error(errorMsg);
            reject(new Error(errorMsg));
          }
        } else {
          resolve();
        }
        compiler.close(() => {
        });
      });
    } catch (e) {
      reject(e);
    }

  });
}
