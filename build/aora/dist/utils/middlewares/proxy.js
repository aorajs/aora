"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevProxyMiddlewaresArr = void 0;
const http_proxy_middleware_1 = require("http-proxy-middleware");
function onProxyReq(proxyReq, req) {
    Object.keys(req.headers).forEach(function (key) {
        proxyReq.setHeader(key, req.headers[key]);
    });
}
const getDevProxyMiddlewaresArr = async (config, _options) => {
    const { fePort, proxy, isDev, https, proxyKey } = config;
    const proxyMiddlewaresArr = [];
    function registerProxy(proxy) {
        for (const path in proxy) {
            const options = proxy[path];
            // 如果底层服务端框架是基于 express的。则不需要用 koaConnect 转换为 koa 中间件
            const middleware = (0, http_proxy_middleware_1.createProxyMiddleware)(path, options);
            proxyMiddlewaresArr.push(middleware);
        }
    }
    proxy && registerProxy(proxy);
    if (isDev) {
        // Webpack 场景 在本地开发阶段代理 serverPort 的资源到 fePort
        // 例如 http://localhost:3000/static/js/page.chunk.js -> http://localhost:8888/static/js/page.chunk.js
        const remoteStaticServerOptions = {
            target: `${https ? 'https' : 'http'}://127.0.0.1:${fePort}`,
            changeOrigin: true,
            secure: false,
            onProxyReq,
            logLevel: 'warn'
        };
        const proxyPathMap = {
            '/sockjs-node': remoteStaticServerOptions,
            '/__webpack_dev_server__': remoteStaticServerOptions
        };
        for (const key of proxyKey) {
            proxyPathMap[key] = remoteStaticServerOptions;
        }
        registerProxy(proxyPathMap);
    }
    return proxyMiddlewaresArr;
};
exports.getDevProxyMiddlewaresArr = getDevProxyMiddlewaresArr;
