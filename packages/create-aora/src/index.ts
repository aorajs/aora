import meow from 'meow';
import path from 'path';
import inquirer from 'inquirer';
import { createApp } from './create-app';

const help = `
  Usage:
    $ npx create-aora [flags...] [<dir>]

  If <dir> is not provided up front you will be prompted for it.

  Flags:
    --help, -h          Show this help message
    --version, -v       Show the version of this script
`;

export async function main() {
  const { input, flags, showHelp, showVersion, pkg } = meow(help, {
    flags: {
      help: { type: 'boolean', default: false, alias: 'h' },
      version: { type: 'boolean', default: false, alias: 'v' },
    },
  });
  console.log('pkg', pkg);

  if (flags.help) showHelp();
  if (flags.version) showVersion();
  console.log('💿 Welcome to Aora! Let\'s get you set up with a new project.');
  let projectDir = path.resolve(
    process.cwd(),
    input.length > 0
      ? input[0]
      : (
        await inquirer.prompt<{ dir: string }>([
          {
            type: 'input',
            name: 'dir',
            message: 'Where would you like to create your app?',
            default: './my-remix-app',
          },
        ])
      ).dir,
  );
  await createApp(projectDir);
}


main().then(
  () => {
    process.exit(0);
  },
  error => {
    console.error(error);
    process.exit(1);
  },
);
