import { IContext } from '@aora/types';
import { join } from 'path';
import { Context, createContext, useContext } from 'react';

function getContext() {
  let context: Context<IContext>;
  // @ts-ignore
  if (typeof window !== 'undefined' && window.HTMLElement) {
    // @ts-ignore
    context = window.STORE_CONTEXT || createContext<IContext>({ state: {} });
    // @ts-ignore
    // window.STORE_CONTEXT = context;
  } else {
    context = createContext<IContext>({
      state: {},
    });
  }
  return context;
}

export const STORE_CONTEXT: Context<IContext> = getContext();
export const context = STORE_CONTEXT;

export const useAoraContext = () => {
  return useContext(STORE_CONTEXT);
};

export function getLayout() {
  return import(
    require.resolve(join(process.cwd(), './web/layouts/index.tsx'))
  );
}

export { AoraEntryContext, Metas, Scripts } from './components';

// export {
//   findEntry
// } from './utils'
