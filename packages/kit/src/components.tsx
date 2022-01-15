import React from 'react';
import type { Location } from 'history';
import type { Navigator } from 'react-router';
// import { join } from 'path';
import { Router } from 'react-router-dom';
import { Action } from 'history';
// import * as process from 'process';

// const Document = require(join(process.cwd(), 'app/layouts/index.tsx'));
// @ts-ignore
import Document from '@/layouts/root.tsx';

interface AoraEntryContextType extends Record<string, any> {
  // manifest: AssetsManifest;
  // matches: RouteMatch<ClientRoute>[];
  // routeData: { [routeId: string]: RouteData };
  // actionData?: RouteData;
  // pendingLocation?: Location;
  // appState: AppState;
  // routeModules: RouteModules;
  // serverHandoffString?: string;
  // clientRoutes: ClientRoute[];
  // transitionManager: ReturnType<typeof createTransitionManager>;
}

const AoraEntryContext = React.createContext<AoraEntryContextType | undefined>(undefined);

function dedupe(array: any[]) {
  return [...new Set(array)];
}

export function useAoraEntryContext(): AoraEntryContextType {
  // invariant(context, "You must render this element inside a <Remix> element");
  return React.useContext(AoraEntryContext)!;
}

export function AoraEntry(
  {
    location: historyLocation,
    base: base,
    navigator: _navigator,
    context: context,
    static: staticProp = false,
  }: {
    location: Location
    base: string
    context: any
    navigator: Navigator
    action: Action;
    static?: boolean
  }) {
  let navigator: Navigator = React.useMemo(() => {
    let push: Navigator['push'] = (to, state) => {
      return _navigator.push(to, state);
    };
    return { ..._navigator, push };
  }, [_navigator]);

  const _document = React.useMemo(async () => {
    return <div>ffff</div>;
  }, []);

  return <AoraEntryContext.Provider value={{}}>
    {/*<Router location={historyLocation} navigator={navigator}*/}
    {/*        basename={base}*/}
    {/*        static={staticProp}>*/}
    1111111
    <Document />
    {/*</Router>*/}
  </AoraEntryContext.Provider>;
}
