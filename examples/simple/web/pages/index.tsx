import { ReactFetch, SProps } from 'aora';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { IData, IndexData } from '~/typings/data';

const Home = (props: SProps & IData) => {
  // const { state, dispatch } = useContext<IContext<IData>>(STORE_CONTEXT);
  return (
    <div>
      <NavLink to="/posts">Posts</NavLink>
    </div>
  );
};

export default Home;

export const fetch: ReactFetch<{
  apiService: {
    index: () => Promise<IndexData>;
  };
}> = async ({ ctx, data, routerProps }) => {
  const res = __isBrowser__
    ? await (await window.fetch('/api/index')).json()
    : await ctx!.apiService?.index();
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    indexData: res,
  };
};
