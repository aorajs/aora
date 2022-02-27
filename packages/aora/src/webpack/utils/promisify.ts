import { promisify } from 'util';
import * as webpack from 'webpack';
import type { Configuration } from "webpack";

const webpackPromisify = promisify<Configuration>(
  webpack,
);

export { webpackPromisify };
