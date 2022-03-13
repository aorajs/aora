import { Metas, Scripts } from '@aora/react';
import { LayoutProps } from 'aora';
import React from 'react';
import App from './App';

const Layout = (props: LayoutProps) => {
  // 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑
  const { injectCss, injectScript } = props.staticList!;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="icon" href="/favicon.ico" />
        <Metas title="AoraJs"/>
        {injectCss}
      </head>
      <body>
        <div id="app">
          <App {...props} />
        </div>
        <Scripts />
        {injectScript}
      </body>
    </html>
  );
};

export default Layout;
