import { Module } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Website } from './website.entity';
import { Publisher } from '../publisher/publisher.entity';
import { PublisherService } from '../publisher/publisher.service';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Website, Publisher])],
  providers: [WebsiteService, PublisherService, CacheService],
  controllers: [WebsiteController],
})
export class WebsiteModule {}
