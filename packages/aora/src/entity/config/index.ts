import { IConfig } from '@aora/types'
import { cleanOutDir } from '../../cli/clean'
import { promises as fsp } from 'fs'
import { getCwd } from '../..'
import { join } from 'path'

export * from './client'
export * from './server'

export class Aora {
    constructor(private config: IConfig) {
        //
    }

    async startServer() {
        const { start: server } = await import('../../server/start')
        await server(this.config)
    }

    async startClient() {
        const { start: client } = await import('..')
        await client(this.config)
    }

    async buildServer() {
        const { build: server } = await import('../../server/build')
        await server(this.config)
    }

    async parseRoutes() {
        const { parseFeRoutes } = await import('../../utils/parse')
        await parseFeRoutes(this.config)
    }

    async buildClient() {
        const { build: client } = await import('..')
        await client(this.config)
    }

    async clean() {
        await cleanOutDir()
    }

    async setupBuildId() {
        await fsp.writeFile(join(getCwd(), './.aora/BUILD_ID'), Math.floor(Math.random() * 100).toString())
    }
}