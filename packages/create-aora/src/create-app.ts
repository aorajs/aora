import * as path from 'path';
import { execSync } from 'child_process';
import * as fse from 'fs-extra';

export async function createApp(projectDir: string) {
  let relativeProjectDir = path.relative(process.cwd(), projectDir);
  let projectDirIsCurrentDir = relativeProjectDir === '';
  if (!projectDirIsCurrentDir) {
    if (fse.existsSync(projectDir)) {
      console.log(
        `️🚨 Oops, "${relativeProjectDir}" already exists. Please try again with a different directory.`,
      );
      process.exit(1);
    } else {
      await fse.mkdirp(projectDir);
    }
  }
  const sharedTemplate = path.resolve(__dirname, '../templates/base');
  await fse.copy(sharedTemplate, projectDir);

  execSync('npm install', { stdio: 'inherit', cwd: projectDir });
}
