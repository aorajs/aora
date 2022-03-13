import {DynamicModule, Global, Module} from '@nestjs/common';
import {AoraRenderService} from './aora.service';
import {createServer} from "./aora";

@Global()
@Module({
  imports: [],
  providers: [AoraRenderService],
  exports: [AoraRenderService],
})
export class AoraModule {

  public static async forRootAsync(options: any): Promise<DynamicModule> {
    const aora = await createServer(options)
    await aora.prepare()
    return {
      module: AoraModule,
      imports: [],
      providers: [AoraRenderService],
      exports: [AoraRenderService],
    }
  }
}
