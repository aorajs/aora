import 'zx/globals';
import * as esbuild from 'esbuild';
import { existsSync, rmdir } from 'fs-extra';
import * as path from 'path';

(async function() {
  try {
    const cwd: string = process.cwd();
    const pkg = require(path.join(cwd, './package.json'));
    const tsconfigFilePath = path.join(cwd, './tsconfig.json');
    const tsconfig = require(tsconfigFilePath);
    const outDir = path.join(cwd, tsconfig.compilerOptions.outDir || 'dist');
    if (existsSync(outDir)) {
      await rmdir(outDir, { recursive: true });
    }
    await esbuild.build({
      platform: 'node',
      target: ['es2020'],
      bundle: true,
      sourcemap: 'external',
      minify: true,
      loader: { '.ts': 'ts' },
      outdir: outDir,
      external: Object.keys(pkg.dependencies),
      logLevel: "silent",
      minifyWhitespace: true,
      tsconfig: tsconfigFilePath,
      entryPoints: ['./src/index.ts'],
    });
    await $`tsc -p ${path.relative(cwd, tsconfigFilePath)} --emitDeclarationOnly`
  } catch (e) {
    console.log(e);
    process.exit(1)
  }
})();
