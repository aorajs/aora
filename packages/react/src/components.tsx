import * as React from 'react';
import invariant from './invariant';
import { createHtml } from './markup';

interface AoraEntryContextType {
  manifest: any;
  serverHandoffString?: string;
}

export const AoraEntryContext = React.createContext<
  AoraEntryContextType | undefined
>(undefined);

let isHydrated = false;

function useAoraEntryContext(): AoraEntryContextType {
  let context = React.useContext(AoraEntryContext);
  invariant(context, 'You must render this element inside a <Remix> element');
  return context;
}

// export function Links() {

//     return (
//         <>

//         </>
//     )
// }

export interface HtmlMetaDescriptor {
  [name: string]: string | string[];
}

export function Metas(meta: HtmlMetaDescriptor) {
  return (
    <>
      {Object.entries(meta).map(([name, value]) => {
        return name === 'title' ? <title key="title">{value}</title> : null;
      })}
    </>
  );
}

export function Scripts(props?: any) {
  const { manifest, serverHandoffString } = useAoraEntryContext();
  console.log(manifest);

  React.useEffect(() => {
    isHydrated = true;
  }, []);

  let initialScripts = React.useMemo(() => {
    let contextScript = serverHandoffString || '';

    return (
      <>
        <script
          {...props}
          suppressHydrationWarning
          dangerouslySetInnerHTML={createHtml(contextScript)}
        />
      </>
    );
  }, []);

  return <>{isHydrated ? null : initialScripts}</>;
}
