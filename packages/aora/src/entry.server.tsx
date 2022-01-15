import React, { ReactElement } from 'react';
import { AoraServer } from './server';

// @ts-ignore
import Layout from '@/layouts/_document.tsx';

export default async function serverRender(_ctx: any, _config: any, url: string | URL): Promise<ReactElement> {
  return (
    <AoraServer context={{}} url={url} base={'/'}>
      <Layout />
    </AoraServer>
  );
}

export async function AoraServer2({ context, base, url }: any): Promise<ReactElement> {
  return (
    <AoraServer context={{}} url={url} base={'/'}>
      <Layout />
    </AoraServer>
  );
}
