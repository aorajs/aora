import { Module } from '@nestjs/common';
import { DetailModule } from './modules/detail-page/detail.module';
import { indexModule } from './modules/index-page/index.module';
import { AoraModule } from "aora/module";
import { HttpModule } from '@nestjs/axios'
import {AppController} from "@/app.controller";

@Module({
  imports: [ HttpModule, AoraModule, DetailModule, indexModule],
  controllers: [AppController]
})
export class AppModule {}
