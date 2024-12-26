import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import configuration from '../config/configuration';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CacheModule.register({
      ttl: 3600, // 1 hour cache
      max: 100, // maximum number of items in cache
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}