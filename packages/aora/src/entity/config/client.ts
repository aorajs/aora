import { IConfig } from '@aora/types';
import { join } from 'path';
import * as WebpackChain from 'webpack-5-chain';
import type { Configuration } from 'webpack';
import { cryptoAsyncChunkName, getOutputPublicPath } from '../../utils';
import { getBaseConfig } from './base';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const safePostCssParser = require('postcss-safe-parser');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const generateAnalysis = Boolean(process.env.GENERATE_ANALYSIS);
const loadModule = require.resolve;
let asyncChunkMap: Record<string, string> = {};

export const getClientWebpack = (config: IConfig): Configuration => {
  const { isDev, chunkName, getOutput, cwd, useHash, chainClientConfig } =
    config;
  const chain = new WebpackChain();
  const shouldUseSourceMap = isDev || Boolean(process.env.GENERATE_SOURCEMAP);
  const publicPath = getOutputPublicPath(config.publicPath, isDev);
  getBaseConfig(chain, config, false);
  chain.devtool(
    isDev
      ? 'cheap-module-source-map'
      : shouldUseSourceMap
        ? 'source-map'
        : false,
  );
  chain
    .entry(chunkName)
    .add(join(__dirname, '../../entry.client'))
    .end()
    .output.path(getOutput().clientOutPut)
    .filename(
      useHash ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    )
    .chunkFilename(
      useHash
        ? 'js/[name].[contenthash:8].js'
        : 'js/[name].chunk.js',
    )
    .publicPath(publicPath)
    .end();
  chain.optimization
    .runtimeChunk(true)
    .splitChunks({
      chunks: 'all',
      name(_module: any, chunks: any, _cacheGroupKey: string) {
        return cryptoAsyncChunkName(chunks, asyncChunkMap);
      },
      cacheGroups: {
        vendors: {
          test: (module: any) => {
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.match('node_modules')
            );
          },
          name: 'vendor',
        },
      },
    })
    .when(!isDev, (optimization) => {
      optimization
        .minimizer('terser')
        .use(loadModule('terser-webpack-plugin'), [
          {
            terserOptions: {
              keep_fnames: true,
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                ascii_only: true,
              },
            },
            extractComments: false,
            parallel: true,
            cache: true,
            sourceMap: shouldUseSourceMap,
          },
        ]);
      optimization
        .minimizer('css-minimizer')
        .use(loadModule('css-minimizer-webpack-plugin'), [
          {
            // optimization: {
            //   minimizer: true
            // },
            minimizerOptions: {},
            parallel: true,
          },
        ]);
    });

  chain.plugin('moduleNotFound').use(ModuleNotFoundPlugin, [cwd]);

  chain.plugin('manifest-plugin').use(WebpackManifestPlugin, [
    {
      fileName: 'asset-manifest.json',
    },
  ]);

  chain.when(generateAnalysis, (chain) => {
    chain.plugin('analyze').use(BundleAnalyzerPlugin);
  });
  // chain.plugin('WriteAsyncManifest').use(
  //   class WriteAsyncChunkManifest {
  //     apply(compiler: any) {
  //       compiler.hooks.watchRun.tap('thisCompilation', async () => {
  //         // 每次构建前清空上一次的 chunk 信息
  //         asyncChunkMap = {};
  //       });
  //       compiler.hooks.done.tapAsync(
  //         'WriteAsyncChunkManifest',
  //         async (_params: any, callback: any) => {
  //           await promises.writeFile(
  //             resolve(getCwd(), './.aora/asyncChunkMap.json'),
  //             JSON.stringify(asyncChunkMap),
  //           );
  //           callback();
  //         },
  //       );
  //     }
  //   },
  // );
  chainClientConfig(chain); // 合并用户自定义配置
  // chain.optimization.get('splitChunks').chunks = 'initial';

  return chain.toConfig();
};
