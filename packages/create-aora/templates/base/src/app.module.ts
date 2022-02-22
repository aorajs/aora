import { Module } from '@nestjs/common';
import { DetailModule } from './modules/detail-page/detail.module';
import { indexModule } from './modules/index-page/index.module';
import { AoraModule } from "aora/module";

@Module({
  imports: [AoraModule, DetailModule, indexModule],
})
export class AppModule {}
