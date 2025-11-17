import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { Publisher } from './publisher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Website } from '../website/website.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publisher, Website])],
  providers: [PublisherService],
  controllers: [PublisherController],
  exports: [PublisherService],
})
export class PublisherModule {}
