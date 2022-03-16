import { Module } from '@nestjs/common';
import { DetailModule } from './modules/detail-page/detail.module';
import { indexModule } from './modules/index-page/index.module';
import { AoraModule } from "aora/module";
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [ HttpModule, AoraModule.forRootAsync({

  }), DetailModule, indexModule],
})
export class AppModule {}
