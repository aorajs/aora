import { Global, Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
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
export class AoraModule implements OnApplicationBootstrap, OnApplicationShutdown {

  constructor() {
    console.log('AoraModule')
  }

  onApplicationShutdown(signal?: string) {
    console.log(signal)
    // throw new Error('Method not implemented.')
  }

  onApplicationBootstrap() {
    console.log('Method not implemented.')
    // throw new Error('Method not implemented.')
  }
}