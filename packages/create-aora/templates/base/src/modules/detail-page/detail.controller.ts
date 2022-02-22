import {Controller, Get, Inject } from '@nestjs/common';
import { ApiDetailService } from './detail.service';
import {AoraRenderService} from "aora/module";

@Controller('/')
export class DetailController {
  constructor(private readonly apiDetailService: ApiDetailService,         @Inject(AoraRenderService)
  private readonly render: AoraRenderService
  ) {}

  @Get('/detail/:id')
  async handlerDetail(): Promise<any> {
      const ctx = {
        apiDetailService: this.apiDetailService,
      };
      return await this.render.ssr(ctx);
  }
}
