import { ReactFetch } from '@aora/types';
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { IndexData } from '~/typings/data';
import type { AoraPage } from 'aora';

const PostsList: AoraPage<any> = (props) => {
  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <div>
      Posts
      <NavLink to='/posts/add'>Add</NavLink>
    </div>
  );
};

export default PostsList;

export const fetch: ReactFetch<{
  apiService: {
    index: () => Promise<IndexData>;
  };
}> = async ({ data, routerProps }) => {
  const res = __isBrowser__
    ? await (await window.fetch('/api/index')).json()
    : await data?.apiService?.index();
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    indexData: res,
  };
};
