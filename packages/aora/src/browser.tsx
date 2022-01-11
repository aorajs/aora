import { AoraEntry } from "./components";
import * as React from 'react'
import type { BrowserHistory, Update } from "history";
import { createBrowserHistory } from "history";

import type { ReactElement } from "react";
interface AoraBrowserProps {
    //
}

export function AoraBrowser(_props: AoraBrowserProps): ReactElement {

    let historyRef = React.useRef<BrowserHistory>();
    if (historyRef.current == null) {
      historyRef.current = createBrowserHistory({ window });
    }
  
    let history = historyRef.current;
    let [state, dispatch] = React.useReducer(
        (_: Update, update: Update) => update,
        {
          action: history.action,
          location: history.location
        }
      );
      React.useLayoutEffect(() => history.listen(dispatch), [history]);

    return <AoraEntry 
    location={state.location}
    base="/"
    navigator={history}></AoraEntry>
}