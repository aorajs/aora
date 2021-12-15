import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import type { Request, Response } from 'express'
// @ts-ignore
import { render } from './render'
import { getCwd } from './index'
import { join } from 'path'
import { promises as fsp } from 'fs'

const cacache = require('cacache')
const cachePath = join(getCwd(), './build/caches')
const crypto = require('crypto');

const md5 = (value: string) => {
  return crypto.createHash('md5').update(value).digest('hex')
}

type RenderOptions = Partial<{
  ssr: Boolean
  stream: Boolean
  cache: Boolean
}>

@Injectable({ scope: Scope.REQUEST })
export class AoraRenderService {
  private readonly response: Response

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.response = request.res!
    this.request = request
    fsp.mkdir(cachePath, { recursive: true })
  }

  async csr(data?: unknown, options: Exclude<RenderOptions, 'ssr'> = {}) {
    console.log('csr', data)
    return this.render(data, {
      ...options,
      ssr: false
    })
  }

  async ssr(data?: unknown, options: Exclude<RenderOptions, 'ssr'> = {}) {
    console.log('ssr', data)
    return this.render(data, {
      ...options,
      ssr: true
    })
  }

  async render(data?: unknown, options: RenderOptions = {}) {
    try {
      const { cache = false, ...opts } = options
      let cacheData
      let cacheKey
      if (cache && (cacheKey = md5(this.request.url))) {
        try {
          cacheData = await cacache.get(cachePath, cacheKey)?.data;
          if (cacheData) {
            if (Buffer.isBuffer(cacheData)) {
              cacheData = cacheData.toString()
            }
            if (cacheData) return cacheData;
          }
        } catch (error) {
          console.log(error)
        }
      }
      const ctx = {
        request: this.request,
        response: this.response,
        data: data,
      };
      const res = await render(ctx, opts as any);
      if (cache) {
        cacache.put(cachePath, cacheKey, res);
      }
      return res
    } catch (error) {
      this.response.status(500).send(error);
    }
  }
}