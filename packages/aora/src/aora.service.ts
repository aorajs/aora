import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import type { Request , Response} from 'express'
// @ts-ignore
import { render } from 'aora/render'

type RenderOptions = Partial <{
  ssr: Boolean
  stream: Boolean
}>

@Injectable({ scope: Scope.REQUEST })
export class AoraRenderService {
  private readonly response: Response

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.response = request.res!
    this.request = request
  }

  async csr(data?: unknown, options: Exclude<RenderOptions, 'ssr'> = {}){ 
    console.log('csr', data)
    return this.render(data, {
      ...options,
      ssr: false
    })
  }

  async ssr(data?: unknown, options: Exclude<RenderOptions, 'ssr'> = {}){ 
    console.log('ssr', data)
    return this.render(data, {
      ...options,
      ssr: true
    })
  }

  async render(data?: unknown, options: RenderOptions = {}) {
    try {
      const ctx = {
        request: this.request,
        response: this.response,
        data: data,
      };
      const res = await render(ctx, options as any);
      return res
    } catch (error) {
      this.response.status(500).send(error);
    }
  }
}