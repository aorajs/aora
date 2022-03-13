import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { initialSSRDevProxy } from 'aora'

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.disable('x-powered-by');
  app.useStaticAssets('public', { maxAge: '1h', immutable: true });
  await initialSSRDevProxy(app, {
    express: true
  })
  await app.listen(3000);
  return app;
}

export default bootstrap();
console.log('1')


// bootstrap().catch((err) => {
//   console.log(err);
//   process.exit(1);
// });
