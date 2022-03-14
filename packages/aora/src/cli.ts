import {red} from 'colorette';
import * as meow from 'meow';
import type {AoraCommand, Command} from './cli/commands';
import {commands} from './cli/commands';
import {error} from "./utils/log";
import {printAndExit} from "./server/lib/utils";

const helpText = `
Usage
  $ aora build
  $ aora dev
  $ aora routes
Options
  --help, -h          Print this help message and exit
  --version, -v       Print the CLI version and exit
  --json              Print the routes as JSON (aora routes only)
  --sourcemap         Generate source maps (aora build only)
Examples
  $ aora build
  $ aora dev
  $ aora routes
`;

const cli = meow(helpText, {
  autoHelp: true,
  autoVersion: true,
  description: false,
  flags: {
    version: {
      type: 'boolean',
      alias: 'v',
    },
    json: {
      type: 'boolean',
    },
    help: {
      type: 'boolean',
      alias: 'h',
    },
    debug: {
      type: 'boolean',
    },
  },
});

if (cli.flags.version) {
  cli.showVersion();
}

process.on('unhandledRejection', (err) =>
  console.error('[unhandledRejection]', err),
);

process.on('uncaughtException', (err) =>
  error('[uncaughtException]', err.message),
);

function onFatalError(err: unknown) {
  console.error(err);
  process.exit(1);
}

export async function main() {
  const start = Date.now();
  const command = cli.input[0] || 'usage';
  if (!(command in commands)) {
    console.log('\n' + red('Invalid command ' + command));
    await commands.usage().then((r) => r.invoke());
    process.exit(1);
  }

  try {
    const cmd: AoraCommand = await commands[command as Command]();
    if (cli.flags.help) {
      printAndExit(`
Description: ${cmd.meta.description}
Usage: $ ${cmd.meta.usage}
`, 0)
    }
    await cmd.invoke(cli.flags).catch(onFatalError);
    console.log(`💫 Done in ${Date.now() - start}ms`);
  } catch (err) {
    onFatalError(err);
  }
}
