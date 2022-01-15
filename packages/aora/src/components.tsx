import React, { createContext, useContext, useMemo } from 'react';
import type { Location } from 'history';
import type { Navigator } from 'react-router';
// import { join } from 'path'

// @ts-ignore
// const Document = require(join(process.cwd(), 'app/layouts/index.tsx'))
import {
  Router,
} from 'react-router-dom';

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

const AoraEntryContext = createContext<AoraEntryContextType | undefined>(undefined);

export function useAoraEntryContext(): AoraEntryContextType {
  let context = useContext(AoraEntryContext)!;
  // invariant(context, "You must render this element inside a <Remix> element");
  return context;
}

export function AoraEntry({
                            location: historyLocation, base,
                            navigator: _navigator,
                            static: staticProp = false,
                          }: {
  location: Location
  base: string
  navigator: Navigator
  static?: boolean
}) {
  let navigator: Navigator = useMemo(() => {
    let push: Navigator['push'] = (to, state) => {
      return _navigator.push(to, state);
    };
    return { ..._navigator, push };
  }, [_navigator]);

  return <AoraEntryContext.Provider value={{}}>
    <Router location={historyLocation} navigator={navigator}
            basename={base}
            static={staticProp}>
      fffffff
      {/*<Document.default />*/}
      {historyLocation.pathname}
    </Router>
  </AoraEntryContext.Provider>;
}
