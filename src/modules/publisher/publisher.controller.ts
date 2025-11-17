import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  Query,
  NotFoundException,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublisherCacheInterceptor } from 'src/cache/publisher.cache.interceptor';

@Controller('publisher')
@UseInterceptors(PublisherCacheInterceptor)
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get()
  findAll(@Query('includeWebsites') includeWebsites?: string) {
    const include = includeWebsites === 'true';
    return this.publisherService.findAll(include);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const publisher = await this.publisherService.findOne(id);
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    return publisher;
  }

  @Post()
  upsert(@Body() dto: CreatePublisherDto) {
    return this.publisherService.upsert(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.publisherService.remove(id);
  }
}
