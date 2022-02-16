import React from "react";
import { SProps, ReactFetch } from "aora";
import Player from "@/components/player";
import Brief from "@/components/brief";
import Recommend from "@/components/recommend";
import Search from "@/components/search";
import {
  Ddata,
  RecommendDataNode,
  PlayerDataNode,
  BriefDataNode,
} from "~/typings/data";
import { useHistory } from "react-router";

export default (props: SProps & Ddata) => {
  console.log(props)
  const history = useHistory()
  console.log(props.detailData?.data[0].dataNode)
  console.log(history)
  return (
    <div>
      <Search></Search>
      {props.detailData?.data[0].dataNode ? (
        <div>
          <Player
            data={props.detailData.data[0].dataNode as PlayerDataNode[]}
          />
          <Brief data={props.detailData.data[1].dataNode as BriefDataNode[]} />
          <Recommend
            data={props.detailData.data[2].dataNode as RecommendDataNode[]}
          />
        </div>
      ) : (
        <img
          src="https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif"
          className="loading"
        />
      )}
    </div>
  );
};

export const fetch: ReactFetch<
  {
    apiDeatilservice: {
      index: (id: string) => Promise<Ddata>;
    };
  },
  { id: string }
> = async ({ ctx, routerProps }) => {
  const data = __isBrowser__
    ? await (
        await window.fetch(`/api/detail/${routerProps!.match.params.id}`)
      ).json()
    : await ctx!.apiDeatilservice.index(ctx!.request.params.id);
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    detailData: data,
  };
};
