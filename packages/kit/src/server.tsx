import { ReactElement } from "react";

export interface AoraServerProps {
    context: any;
    url: string | URL;
    base: string;
  }
export function RemixServer({ context, url }: AoraServerProps): ReactElement {
    if (typeof url === "string") {
        url = new URL(url);
      }

      
}