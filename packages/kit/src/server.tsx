import type { ReactElement } from 'react';
import * as React from 'react';

export interface AoraServerProps {
  context: any;
  url: string | URL;
  base: string;
}

export function AoraServer({ context, url }: AoraServerProps): ReactElement {
  if (typeof url === 'string') {
    // url = new URL(url);
  }
  console.log(context);

  return (<div>fff</div>);
}
