import { DynamicModule, Global, Module } from '@nestjs/common';
import { AoraRenderService } from './aora.service';
import { AORA_MODULE_OPTIONS } from './aora.constants';
import { createAoraServer } from './aora.provider';
import { AoraModuleOptions } from './aora.interface';

@Global()
@Module({
  imports: [],
  providers: [AoraRenderService],
  exports: [AoraRenderService],
})
export class AoraModule {

  public static async forRootAsync(options: AoraModuleOptions = {}): Promise<DynamicModule> {
    return {
      module: AoraModule,
      imports: [],
      providers: [
        createAoraServer(),
        {
          provide: AORA_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [AoraRenderService],
    }
  }
}
