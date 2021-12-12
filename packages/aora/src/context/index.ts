// The file is provisional，don't depend on it
import { Context, createContext, useContext } from "react";
import { IContext } from '@aora/types'

function getContext() {
  let context: Context<IContext>;
  // @ts-ignore
  if (typeof window !== "undefined" && window.HTMLElement) {
    // @ts-ignore
    context =  (window.STORE_CONTEXT || createContext<IContext>({ state: {}, }))
    // @ts-ignore
    window.STORE_CONTEXT = context;
  } else {
    context = createContext<IContext>({
      state: {},
    });
  }
  return context
}

export const STORE_CONTEXT: Context<IContext> = getContext()

export const useAoraContext = () => {
  return useContext(STORE_CONTEXT)
}