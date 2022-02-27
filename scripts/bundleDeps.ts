import { execSync } from 'child_process';
import { build } from 'esbuild';
import { existsSync, rmdir } from 'fs-extra';
import * as path from 'path';

const cwd: string = process.cwd();
const pkg = require(path.join(cwd, './package.json'));
const tsconfigFilePath = path.join(cwd, './tsconfig.json');

const buildEsm = async () => {
  const outDir = path.join(cwd, 'es');
  if (existsSync(outDir)) {
    await rmdir(outDir, { recursive: true });
  }
  await build({
    platform: 'node',
    target: ['es2020'],
    bundle: true,
    format: 'esm',
    sourcemap: 'external',
    minify: true,
    loader: { '.ts': 'ts' },
    outdir: outDir,
    external: Object.keys(pkg.dependencies),
    minifyWhitespace: true,
    tsconfig: tsconfigFilePath,
    entryPoints: ['./src/index.ts'],
  });
  execSync(
    `tsc -p ${path.relative(cwd, tsconfigFilePath)} --emitDeclarationOnly --outDir es`,
  );
}

const buildLib = async () => {
  const outDir = path.join(cwd, 'dist');
  if (existsSync(outDir)) {
    await rmdir(outDir, { recursive: true });
  }
  await build({
    platform: 'node',
    target: ['es2020'],
    bundle: true,
    sourcemap: 'external',
    minify: true,
    loader: { '.ts': 'ts' },
    outdir: outDir,
    external: Object.keys(pkg.dependencies),
    minifyWhitespace: true,
    tsconfig: tsconfigFilePath,
    entryPoints: ['./src/index.ts'],
  });
  execSync(
    `tsc -p ${path.relative(cwd, tsconfigFilePath)} --emitDeclarationOnly --outDir lib`,
  );
}

(async function () {
  try {
    // const tsconfigFilePath = path.join(cwd, './tsconfig.json');
    if (pkg.module) {
      await buildEsm()
    }
    await buildLib()
    // const outDir = path.join(cwd, tsconfig.compilerOptions.outDir || 'dist');
    // if (existsSync(outDir)) {
    //   await rmdir(outDir, { recursive: true });
    // }
    // await build({
    //   platform: 'node',
    //   target: ['es2020'],
    //   bundle: true,
    //   sourcemap: 'external',
    //   minify: true,
    //   loader: { '.ts': 'ts' },
    //   outdir: outDir,
    //   external: Object.keys(pkg.dependencies),
    //   minifyWhitespace: true,
    //   tsconfig: tsconfigFilePath,
    //   entryPoints: ['./src/index.ts'],
    // });
    // execSync(
    //   `tsc -p ${path.relative(cwd, tsconfigFilePath)} --emitDeclarationOnly`,
    // );
  } catch (e) {
    console.log(e);
  }
})();
