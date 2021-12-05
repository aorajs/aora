import { defineConfig } from 'dumi';
const repo = 'aora';

export default defineConfig({
  title: 'Aora',
  mode: 'site',
  outputPath: 'docs-dist',
  base: `/${repo}/`,
  publicPath: `/${repo}/`,
  // more config: https://d.umijs.org/config
});
