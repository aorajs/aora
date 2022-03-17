import type { ParsedUrlQuery } from 'querystring';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import type { ComponentType } from 'react';

export type BaseContext = {
  res?: any
  [k: string]: any
}

/**
 * `Aora` context
 */
export interface AoraPageContext {
  /**
   * Error object if encountered during rendering
   */
  err?: (Error & { statusCode?: number }) | null;
  /**
   * `HTTP` request object.
   */
  req?: ExpressRequest;
  /**
   * `HTTP` response object.
   */
  res?: ExpressResponse;
  /**
   * Path section of `URL`.
   */
  pathname: string;
  /**
   * Query string section of `URL` parsed as an object.
   */
  query: ParsedUrlQuery;
  /**
   * `String` of the actual path including query.
   */
  asPath?: string;
  /**
   * The currently active locale
   */
  locale?: string;
  /**
   * All configured locales
   */
  locales?: string[];
  /**
   * The configured default locale
   */
  defaultLocale?: string;
  /**
   * `Component` the tree of the App to use if needing to render separately
   */
  AppTree: any;
}

export type AoraComponentType<C extends BaseContext = AoraPageContext,
  IP = {},
  P = {}> = ComponentType<P> & {
  /**
   * Used for initial page load data population. Data returned from `getInitialProps` is serialized when server rendered.
   * Make sure to return plain `Object` without using `Date`, `Map`, `Set`.
   * @param context Context of `page`
   */
  getInitialProps?(context: C): IP | Promise<IP>
}

/**
 * `Page` type, use it as a guide to create `pages`.
 */
export type AoraPage<P = {}, IP = P> = AoraComponentType<AoraPageContext, IP, P>
