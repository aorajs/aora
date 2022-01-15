import React, { useContext } from 'react';
import type { Location } from 'history';
import { ThrownResponse } from './errors';
import { CatchBoundaryComponent } from './routeModules';

type AoraErrorBoundaryProps = React.PropsWithChildren<{
  location: Location;
  // component: ErrorBoundaryComponent;
  error?: Error;
}>;

type AoraErrorBoundaryState = {
  error: null | Error;
  location: Location;
};

export class AoraErrorBoundary extends React.Component<AoraErrorBoundaryProps,
  AoraErrorBoundaryState> {

  render() {
    return this.props.children;
  }
}

let AoraCatchContext = React.createContext<ThrownResponse | undefined>(
  undefined,
);

export function useCatch<Result extends ThrownResponse = ThrownResponse>(): Result {
  return useContext(AoraCatchContext) as Result;
}

type AoraCatchBoundaryProps = React.PropsWithChildren<{
  location: Location;
  component: CatchBoundaryComponent;
  catch?: ThrownResponse;
}>;

export function AoraCatchBoundary(
  {
    catch: catchVal,
    component: Component,
    children,
  }: AoraCatchBoundaryProps) {
  if (catchVal) {
    return (
      <AoraCatchContext.Provider value={catchVal}>
        <Component />
      </AoraCatchContext.Provider>
    );
  }

  return <>{children}</>;
}

/**
 * When app's don't provide a root level CatchBoundary, we default to this.
 */
export function AoraRootDefaultCatchBoundary() {
  let caught = useCatch();
  return (
    <html lang='en'>
    <head>
      <meta charSet='utf-8' />
      <meta
        name='viewport'
        content='width=device-width,initial-scale=1,viewport-fit=cover'
      />
      <title>Unhandled Thrown Response!</title>
    </head>
    <body>
    <h1 style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      {caught.status} {caught.statusText}
    </h1>
    <script
      dangerouslySetInnerHTML={{
        __html: `
              console.log(
                "💿 Hey developer👋. You can provide a way better UX when your app throws 404s (and other responses) than this. Check out https://remix.run/guides/not-found for more information."
              );
            `,
      }}
    />
    </body>
    </html>
  );
}

