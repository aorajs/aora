import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request, Response } from 'express';
import { render } from './render';

type RenderOptions = Partial<{
  ssr: Boolean;
  stream: Boolean;
  cache: Boolean;
}>;

@Injectable({ scope: Scope.REQUEST })
export class AoraRenderService {
  private readonly response: Response;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.response = request.res!;
    this.request = request;
  }

  async csr(data?: unknown, options: Exclude<RenderOptions, 'ssr'> = {}) {
    return this.render(data, {
      ...options,
      ssr: false,
    });
  }

  async ssr(data?: unknown, options: Exclude<RenderOptions, 'ssr'> = {}) {
    return this.render(data, {
      ...options,
      ssr: true,
    });
  }

  async render(data?: unknown, options: RenderOptions = {}) {
    try {
      const { cache = false, ...opts } = options;
      const ctx = {
        request: this.request,
        response: this.response,
      };
      return await render(data, ctx, opts as any);
    } catch (error) {
      console.log(error);
      this.response.status(500).send(error);
    }
  }
}
