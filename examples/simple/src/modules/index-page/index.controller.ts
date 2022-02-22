import {Controller, Get, Inject, Req} from '@nestjs/common';
import { Request } from 'express';
import { ApiService } from './index.service';
import { AoraRenderService } from "aora/module";

@Controller('/')
export class AppController {
  constructor(private readonly apiService: ApiService,
              @Inject(AoraRenderService)
              private readonly render: AoraRenderService
              ) {}

  @Get('/')
  async handlerIndex(): Promise<any> {
    const ctx = {
      apiService: this.apiService,
    };
    return await this.render.ssr(ctx);
  }

  @Get('/posts')
  async handlerPosts(@Req() req: Request): Promise<any> {
    const ctx = {
      apiService: this.apiService,
    };
    return await this.render.ssr(ctx);
  }

  @Get('/posts/add')
  async handlerPostAdd(@Req() req: Request): Promise<any> {
    const ctx = {
      apiService: this.apiService,
    };
    return await this.render.ssr(ctx);
  }
}
