import React, { ReactElement } from 'react';
import type { Location } from 'history';
import type { Navigator } from 'react-router';
// import { join } from 'path';
// import { Router } from 'react-router-dom';
import { Action } from 'history';
// import * as process from 'process';

// @ts-ignore
import Document from '@/layouts/_document.tsx';

// import { Router } from 'react-router';
import { AoraCatchBoundary, AoraErrorBoundary, AoraRootDefaultCatchBoundary } from './errorBoundaries';
import invariant from './invariant';
import {
  Router,
  Link as RouterLink,
  NavLink as RouterNavLink,
  useLocation,
  useRoutes,
  useNavigate,
  useHref,
  useResolvedPath,
} from 'react-router-dom';

function Routes() {
  // TODO: Add `renderMatches` function to RR that we can use and then we don't
  // need this component, we can just `renderMatches` from RemixEntry
  let { clientRoutes } = useAoraEntryContext();
  // fallback to the root if we don't have a match
  let element = useRoutes(clientRoutes) || (clientRoutes[0].element as any);
  return element;
}

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
  let context = React.useContext(AoraEntryContext)!;
  console.log('context', context)
  invariant(context, 'You must render this element inside a <Aora> element');
  return context;
}

export function AoraEntry(
  {
    location: historyLocation,
    base: base,
    navigator: _navigator,
    context: context,
    static: staticProp = false,
    action,
    children,
  }: {
    location: Location
    base: string
    context: any
    navigator: Navigator
    action: Action;
    static?: boolean;
    children: ReactElement | ReactElement[]
  }): ReactElement {
  // let clientRoutes = React.useMemo(
  //   () => createClientRoutes(manifest.routes, routeModules, RemixRoute),
  //   [manifest, routeModules]
  // );
  let navigator: Navigator = React.useMemo(() => {
    let push: Navigator['push'] = (to, state) => {
      return _navigator.push(to, state);
    };
    return { ..._navigator, push };
  }, [_navigator]);

  return (
    <AoraEntryContext.Provider value={{}}>
      <AoraErrorBoundary
        location={historyLocation}
        error={undefined}
      >
        <AoraCatchBoundary
          location={historyLocation}
          component={AoraRootDefaultCatchBoundary}
          catch={undefined}
        >
          <Router
            navigationType={action}
            location={historyLocation}
            navigator={_navigator}
            static={staticProp}
          >
            <Routes />
            {/*{children}*/}
          </Router>
        </AoraCatchBoundary>
        {/*<Router location={historyLocation} navigator={navigator} static={true}>*/}
        {/*<Document>*/}
        {/*</Document>*/}
        {/*</Router>*/}
      </AoraErrorBoundary>
    </AoraEntryContext.Provider>
  );
}
