import type {LayoutProps, ReactFetch} from 'aora';
import React, {useContext, useEffect} from 'react';
import {STORE_CONTEXT} from "@aora/react";

export default (props: LayoutProps) => {
  const {state} = useContext(STORE_CONTEXT)

  useEffect(() => {
    console.log(state)
  }, [state])

  return <div>{props.children}</div>;
};

export const fetch: ReactFetch<any> = async ({ctx, routerProps}) => {
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    layoutData: {},
  };
};
