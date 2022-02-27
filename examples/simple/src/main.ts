import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { readConfig } from '@aora/cli';
import { AppModule } from './app.module';
import { initialSSRDevProxy } from 'aora'

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.disable('x-powered-by');
  app.useStaticAssets('public', { maxAge: '1h', immutable: true });
  const { serverPort } = readConfig();
  await initialSSRDevProxy(app, {
    express: true
  })
  await app.listen(serverPort);
  return app;
}

export default bootstrap();

// bootstrap().catch((err) => {
//   console.log(err);
//   process.exit(1);
// });
