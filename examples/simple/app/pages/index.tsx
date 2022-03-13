import {ReactFetch, SProps} from 'aora';
import React from 'react';
import {IData, IndexData} from '~/typings/data';
import './index.less'

const Home = (props: SProps & IData) => {
  return (
    <div>
      <main>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>

        <div className="grid">
          <a href="https://nextjs.org/docs" className="card">
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className="card">
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className="card"
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="card"
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>
      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className="logo"/>
        </a>
      </footer>
    </div>
  )
};


export default Home;

export const fetch: ReactFetch<{
  apiService: {
    index: () => Promise<IndexData>;
  };
}> = async ({ctx, data, routerProps}) => {
  const res = __isBrowser__
    ? await (await window.fetch('/api/index')).json()
    : await ctx!.apiService?.index();
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    indexData: res,
  };
};
