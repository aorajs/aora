import React from "react";
import { SProps, ReactFetch } from "aora";
import Slider from "@/components/slider";
import Rectangle from "@/components/rectangle";
import Search from "@/components/search";
import { IData } from "~/typings/data";
import { IndexData } from "~/typings/data";
import NoSsr from 'aora/noSsr'

const Home = (props: SProps & IData) => {
  // const { state, dispatch } = useContext<IContext<IData>>(STORE_CONTEXT);
  return (
    <div>
      <NoSsr>
        <Search></Search>
      </NoSsr>
      {props.indexData?.data?.[0]?.components ? (
        <div>
          <Slider {...props} data={props.indexData.data[0].components} />
          <Rectangle {...props} data={props.indexData.data[1].components} />
        </div>
      ) : (
        <img
          src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif"
          className="loading"
          alt=""
        />
      )}
    </div>
  );
};

export default Home;

export const fetch: ReactFetch<{
  apiService: {
    index: () => Promise<IndexData>;
  };
}> = async ({ ctx, routerProps }) => {
  const data = __isBrowser__
    ? await (await window.fetch("/api/index")).json()
    : await ctx!.apiService?.index();
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    indexData: data,
  };
};
