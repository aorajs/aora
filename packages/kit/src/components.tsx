import * as React from 'react';
import type { Location } from 'history';
import type { Navigator } from 'react-router';
// import { join } from 'path';
import { Router } from 'react-router-dom';
// import * as process from 'process';

// @ts-ignore
// const Document = require(join(process.cwd(), 'app/layouts/index.tsx'));

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

export function useAoraEntryContext(): AoraEntryContextType {
  // invariant(context, "You must render this element inside a <Remix> element");
  return React.useContext(AoraEntryContext)!;
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
  let navigator: Navigator = React.useMemo(() => {
    let push: Navigator['push'] = (to, state) => {
      return _navigator.push(to, state);
    };
    return { ..._navigator, push };
  }, [_navigator]);

  return <AoraEntryContext.Provider value={{}}>
    <Router location={historyLocation} navigator={navigator}
            basename={base}
            static={staticProp}>
      {/*<Document.default />*/}
      Components
      {historyLocation.pathname}
    </Router>
  </AoraEntryContext.Provider>;
}
