// 此文件将会在服务端/客户端都将会用到
// 可通过 __isBrowser__ 或者 useEffect 判断当前在 浏览器环境做一些初始化操作
import type { LayoutProps, ReactFetch } from 'aora';
import React from 'react';

export default (props: LayoutProps) => {
  return <div>{props.children}</div>;
};

export const fetch: ReactFetch<any> = async ({ ctx, routerProps }) => {
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    layoutData: {},
  };
};
