import type { ReactElement } from 'react';
import React from 'react';
import { AoraEntry } from './components';
import type { Location, To } from 'history';
import { Action, createPath } from 'history';

export interface AoraServerProps {
  context: any;
  url: string | URL;
  base: string;
}

export function AoraServer({ context, url }: AoraServerProps): ReactElement {
  if (typeof url === 'string') {
    url = new URL(url);
  }

  let location: Location = {
    pathname: url.pathname,
    search: url.search,
    hash: '',
    state: null,
    key: 'default',
  };

  let staticNavigator = {
    createHref(to: To) {
      return typeof to === 'string' ? to : createPath(to);
    },
    push(to: To) {
      throw new Error(
        `You cannot use navigator.push() on the server because it is a stateless ` +
        `environment. This error was probably triggered when you did a ` +
        `\`navigate(${JSON.stringify(to)})\` somewhere in your app.`,
      );
    },
    replace(to: To) {
      throw new Error(
        `You cannot use navigator.replace() on the server because it is a stateless ` +
        `environment. This error was probably triggered when you did a ` +
        `\`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere ` +
        `in your app.`,
      );
    },
    go(delta: number) {
      throw new Error(
        `You cannot use navigator.go() on the server because it is a stateless ` +
        `environment. This error was probably triggered when you did a ` +
        `\`navigate(${delta})\` somewhere in your app.`,
      );
    },
    back() {
      throw new Error(
        `You cannot use navigator.back() on the server because it is a stateless ` +
        `environment.`,
      );
    },
    forward() {
      throw new Error(
        `You cannot use navigator.forward() on the server because it is a stateless ` +
        `environment.`,
      );
    },
    block() {
      throw new Error(
        `You cannot use navigator.block() on the server because it is a stateless ` +
        `environment.`,
      );
    },
  };

  return (
    <AoraEntry
      context={context}
      action={Action.Pop}
      location={location}
      base='/'
      navigator={staticNavigator}
      static={true}
    />
  );
}
