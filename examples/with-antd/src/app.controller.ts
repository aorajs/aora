import {Controller, Get, Req, } from '@nestjs/common';
import { Request,  } from 'express';
import { HttpService } from '@nestjs/axios'
import {firstValueFrom} from "rxjs";

@Controller('/')
export class AppController {
  constructor(private readonly http: HttpService,
  ) {}

  @Get('/build/*')
  async handlerIndex(@Req() req: Request): Promise<any> {
    const url = new URL(`${req.protocol}://${req.hostname}${req.url}`)
    url.port = '3010'
    const res = await firstValueFrom(this.http.get(url.toString()))
    req.res.header(res.headers['ContextType'])
    req.res.send(res.data)
  }
}
