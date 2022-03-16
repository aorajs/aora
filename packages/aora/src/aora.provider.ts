import { AORA_MODULE_OPTIONS, AORA_SERVER } from './aora.constants';
import { Provider } from '@nestjs/common';
import { createServer } from './aora';
import { AoraModuleOptions } from './aora.interface';

export const createAoraServer = (): Provider => ({
  provide: AORA_SERVER,
  useFactory: async (options: AoraModuleOptions): Promise<any> => {
    const aora = await createServer(options);
    await aora.prepare();
    return aora;
  },
  inject: [AORA_MODULE_OPTIONS],
});
