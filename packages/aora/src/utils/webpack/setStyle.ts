import { IConfig, StyleOptions } from '@aora/types';
import * as Config from 'webpack-5-chain';
import type { LoaderContext } from 'webpack';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const genericNames = require('generic-names');

export const setStyle = (
  config: IConfig,
  chain: Config,
  reg: RegExp,
  options: StyleOptions,
) => {
  const { css, isDev } = config;
  const { include, exclude, importLoaders, loader, isServer } = options;
  const loadModule = require.resolve;

  const userCssloaderOptions = css?.().loaderOptions?.cssOptions ?? {};
  const defaultCssloaderOptions = {
    importLoaders: importLoaders,
    modules: {
      // 对 .module.xxx 的文件开启 css-modules
      auto: true,
      // 对齐vite 场景 css-loader 与 postcss-modules 生成 hash 方式
      getLocalIdent: (
        context: LoaderContext<any>,
        _localIdentName: any,
        localName: any,
        _options: any,
      ) => {
        return genericNames('[name]__[local]___[hash:base64:5]', {
          context: process.cwd(),
        })(localName, context.resourcePath);
      },
    },
    url: (url: string) => {
      // 绝对路径开头的静态资源地址不处理
      return !url.startsWith('/');
    },
  };

  const finalCssLoaderOptions = Object.assign(
    {},
    defaultCssloaderOptions,
    userCssloaderOptions,
  );
  const postCssPlugins = css?.().loaderOptions?.postcss?.plugins ?? []; // 用户自定义 postcss 插件
  const userPostcssOptions = css?.().loaderOptions?.postcss?.options; // postCssOptions maybe function|object
  const postcssOptions =
    typeof userPostcssOptions === 'function'
      ? userPostcssOptions
      : Object.assign(
        {
          ident: 'postcss',
          plugins: [
            require('postcss-flexbugs-fixes'),
            require('postcss-discard-comments'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
          ].concat(postCssPlugins),
        },
        userPostcssOptions ?? {},
      ); // 合并用户自定义 postcss options

  chain.module
    .rule(options.rule)
    .test(reg)
    .when(Boolean(include), (rule: any) => {
      include && rule.include.add(include).end();
    })
    .when(Boolean(exclude), (rule: any) => {
      exclude && rule.exclude.add(exclude).end();
    })
    .when(isDev, (rule: any) => {
      rule.use('hmr').loader(loadModule('css-hot-loader')).end();
    })
    .use('MiniCss')
    .loader(MiniCssExtractPlugin.loader)
    .options({
      // vite 场景下服务端 bundle 输出 css 文件，否则 服务端不输出
      emit: !isServer,
    })
    .end()
    .use('css-loader')
    .loader(loadModule('css-loader'))
    .options(finalCssLoaderOptions)
    .end()
    .use('postcss-loader')
    .loader(loadModule('postcss-loader'))
    .options({
      postcssOptions: postcssOptions,
    })
    .end()
    .when(Boolean(loader), (rule: any) => {
      loader &&
      rule
        .use(loader)
        .loader(loadModule(loader))
        .when(loader === 'less-loader', (rule: any) => {
          rule.options(
            css?.().loaderOptions?.less ?? {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          );
        })
        .when(loader === 'sass-loader', (rule: any) => {
          rule.options(css?.().loaderOptions?.sass ?? {});
        })
        .end();
    });
};
