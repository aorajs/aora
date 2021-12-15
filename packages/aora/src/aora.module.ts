import { Global, Module } from '@nestjs/common'
import { AoraRenderService } from './aora.service'

@Global()
@Module({
  imports: [

  ],
  providers: [
    AoraRenderService
  ],
  exports: [
    AoraRenderService,
  ],
})
export class AoraModule {}