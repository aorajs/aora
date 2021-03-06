import { IConfig, proxyOptions } from '@aora/types';
import { createProxyMiddleware } from 'http-proxy-middleware';

function onProxyReq(proxyReq: any, req: any) {
  Object.keys(req.headers).forEach(function(key) {
    proxyReq.setHeader(key, req.headers[key]);
  });
}

const getDevProxyMiddlewaresArr = async (
  config: IConfig,
  _options?: proxyOptions,
) => {
  const { fePort, proxy, isDev, https, proxyKey } = config;
  const proxyMiddlewaresArr: any[] = [];

  function registerProxy(proxy: any) {
    for (const path in proxy) {
      const options = proxy[path];
      // 如果底层服务端框架是基于 express的。则不需要用 koaConnect 转换为 koa 中间件
      const middleware = createProxyMiddleware(path, options);
      proxyMiddlewaresArr.push(middleware);
    }
  }

  proxy && registerProxy(proxy);
  if (isDev) {
    // Webpack 场景 在本地开发阶段代理 serverPort 的资源到 fePort
    // 例如 http://localhost:3000/static/js/page.chunk.js -> http://localhost:3010/static/js/page.chunk.js
    const remoteStaticServerOptions = {
      target: `${https ? 'https' : 'http'}://127.0.0.1:${fePort}`,
      changeOrigin: true,
      secure: false,
      onProxyReq,
      logLevel: 'warn',
    };
    console.log(remoteStaticServerOptions);

    const proxyPathMap: Record<string, any> = {
      '/ws': remoteStaticServerOptions,
      '/build': remoteStaticServerOptions,
      '/__webpack_dev_server__': remoteStaticServerOptions,
    };
    for (const key of proxyKey) {
      proxyPathMap[key] = remoteStaticServerOptions;
    }
    registerProxy(proxyPathMap);
  }

  return proxyMiddlewaresArr;
};

export { getDevProxyMiddlewaresArr };
